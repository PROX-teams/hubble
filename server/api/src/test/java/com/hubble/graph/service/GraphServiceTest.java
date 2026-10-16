package com.hubble.graph.service;

import com.hubble.common.entity.Category;
import com.hubble.graph.dto.response.GraphResponse;
import com.hubble.note.dto.TagCountDto;
import com.hubble.note.repository.NoteRepository;
import com.hubble.note.repository.NoteTagRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class GraphServiceTest {

    @InjectMocks
    private GraphService graphService;

    @Mock
    private NoteRepository noteRepository;

    @Mock
    private NoteTagRepository noteTagRepository;

    @Mock
    private GraphStatsStore graphStatsStore;

    @Test
    void initialGraphMixesPopularRecentAndDiscoverySeeds() {
        given(noteRepository.countByCategory(Category.DEVELOPMENT)).willReturn(12L);
        given(graphStatsStore.topTags(Category.DEVELOPMENT, 60))
                .willReturn(List.of(new TagCountDto("PopularA", 20L), new TagCountDto("PopularB", 19L),
                        new TagCountDto("PopularC", 18L), new TagCountDto("PopularD", 17L),
                        new TagCountDto("Discovery", 4L)));
        given(noteTagRepository.findRecentTagsByCategory(eq(Category.DEVELOPMENT), any(),
                eq(org.springframework.data.domain.PageRequest.of(0, 60))))
                .willReturn(List.of(new TagCountDto("Recent", 3L), new TagCountDto("PopularA", 1L)));
        given(noteTagRepository.findTagCountsByCategoryAndTagNames(eq(Category.DEVELOPMENT), anyList()))
                .willReturn(List.of(new TagCountDto("PopularA", 20L), new TagCountDto("PopularB", 19L),
                        new TagCountDto("PopularC", 18L), new TagCountDto("PopularD", 17L),
                        new TagCountDto("Recent", 9L), new TagCountDto("Discovery", 4L)));

        GraphResponse graph = graphService.getGraphData(Category.DEVELOPMENT);

        assertThat(graph.rootNode().usageCount()).isEqualTo(12);
        assertThat(graph.nodes()).extracting("name")
                .contains("PopularA", "PopularD", "Recent", "Discovery");
        assertThat(graph.nodes().stream().filter(node -> node.name().equals("Recent")).findFirst().orElseThrow().usageCount())
                .isEqualTo(9);
        assertThat(graph.links()).allSatisfy(link -> {
            assertThat(link.coOccurrenceCount()).isNull();
            assertThat(link.similarity()).isNull();
        });
    }

    @Test
    void expansionReadsPreparedRankAndSkipsVisibleTags() {
        given(graphStatsStore.rankedNeighbors(eq(Category.DEVELOPMENT), eq("React"),
                eq(java.util.Set.of("React", "TypeScript")), eq(2)))
                .willReturn(List.of(
                        new GraphStatsStore.RankedNeighbor("Next.js", 5L, 7L, 0.5),
                        new GraphStatsStore.RankedNeighbor("Zod", 3L, 4L, 0.3)));

        var expansion = graphService.expandTag(Category.DEVELOPMENT, "React", List.of("TypeScript"), 1);

        assertThat(expansion.nodes()).extracting("name").containsExactly("Next.js");
        assertThat(expansion.hasMore()).isTrue();
        assertThat(expansion.nodes().get(0).usageCount()).isEqualTo(7);
        assertThat(expansion.nodes().get(0).parentId()).isEqualTo("tag_React");
        assertThat(expansion.links().get(0).similarity()).isEqualTo(0.5);
        assertThat(expansion.links().get(0).coOccurrenceCount()).isEqualTo(5);
        org.mockito.Mockito.verify(graphStatsStore).rankedNeighbors(Category.DEVELOPMENT, "React",
                java.util.Set.of("React", "TypeScript"), 2);
        org.mockito.Mockito.verifyNoMoreInteractions(graphStatsStore);
    }
}
