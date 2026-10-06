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
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

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
    void expansionRanksSupportedNeighborsAndExcludesAlreadyVisibleTags() {
        given(graphStatsStore.center(Category.DEVELOPMENT, "React"))
                .willReturn(Optional.of(new GraphStatsStore.Center(1L, 10L)));
        given(graphStatsStore.neighborPage(eq(Category.DEVELOPMENT), eq(1L),
                eq(GraphStatsStore.Side.TAG_A), isNull(), eq(2L), eq(128)))
                .willReturn(List.of(new GraphStatsStore.Neighbor(2L, "TypeScript", 5L, 8L),
                        new GraphStatsStore.Neighbor(3L, "Next.js", 2L, 4L)));

        var expansion = graphService.expandTag(Category.DEVELOPMENT, "React", List.of("Next.js"), 6);

        assertThat(expansion.nodes()).extracting("name").containsExactly("TypeScript");
        assertThat(expansion.nodes().get(0).parentId()).isEqualTo("tag_React");
        assertThat(expansion.links()).singleElement().satisfies(link -> {
            assertThat(link.source()).isEqualTo("tag_React");
            assertThat(link.coOccurrenceCount()).isEqualTo(5);
            assertThat(link.similarity()).isEqualTo(0.38);
        });
        assertThat(expansion.hasMore()).isFalse();
    }

    @Test
    void expansionRanksByJaccardRatherThanCoOccurrence() {
        given(graphStatsStore.center(Category.DEVELOPMENT, "React"))
                .willReturn(Optional.of(new GraphStatsStore.Center(1L, 10L)));
        given(graphStatsStore.neighborPage(eq(Category.DEVELOPMENT), eq(1L),
                eq(GraphStatsStore.Side.TAG_A), isNull(), eq(2L), eq(128)))
                .willReturn(List.of(new GraphStatsStore.Neighbor(2L, "Broad", 8L, 100L),
                        new GraphStatsStore.Neighbor(3L, "Focused", 5L, 5L)));

        var expansion = graphService.expandTag(Category.DEVELOPMENT, "React", List.of(), 1);

        assertThat(expansion.nodes()).extracting("name").containsExactly("Focused");
        assertThat(expansion.hasMore()).isTrue();
    }

    @Test
    void expansionReadsNextPageWhenLowerCoOccurrenceCanStillWin() {
        given(graphStatsStore.center(Category.DEVELOPMENT, "React"))
                .willReturn(Optional.of(new GraphStatsStore.Center(1L, 10L)));
        List<GraphStatsStore.Neighbor> firstPage = IntStream.range(0, 128)
                .mapToObj(i -> new GraphStatsStore.Neighbor(i + 2L, "Broad" + i, 5L, 100L))
                .toList();
        doReturn(firstPage).when(graphStatsStore).neighborPage(eq(Category.DEVELOPMENT), eq(1L),
                eq(GraphStatsStore.Side.TAG_A), isNull(), eq(2L), eq(128));
        doReturn(List.of(new GraphStatsStore.Neighbor(130L, "Focused", 4L, 4L)))
                .when(graphStatsStore).neighborPage(eq(Category.DEVELOPMENT), eq(1L),
                eq(GraphStatsStore.Side.TAG_A), eq(new GraphStatsStore.Cursor(5L, 129L)), eq(2L), eq(128));
        doReturn(List.of()).when(graphStatsStore).neighborPage(eq(Category.DEVELOPMENT), eq(1L),
                eq(GraphStatsStore.Side.TAG_B), isNull(), eq(2L), eq(128));

        var expansion = graphService.expandTag(Category.DEVELOPMENT, "React", List.of(), 1);

        assertThat(expansion.nodes()).extracting("name").containsExactly("Focused");
    }

    @Test
    void expansionStopsOnlyAfterUnseenCandidatesCannotBeatTopResults() {
        given(graphStatsStore.center(Category.DEVELOPMENT, "React"))
                .willReturn(Optional.of(new GraphStatsStore.Center(1L, 10L)));
        List<GraphStatsStore.Neighbor> firstPage = new java.util.ArrayList<>();
        firstPage.add(new GraphStatsStore.Neighbor(2L, "Best", 9L, 9L));
        firstPage.add(new GraphStatsStore.Neighbor(3L, "Second", 8L, 8L));
        firstPage.addAll(IntStream.range(0, 126)
                .mapToObj(i -> new GraphStatsStore.Neighbor(i + 4L, "Weak" + i, 2L, 100L))
                .toList());
        given(graphStatsStore.neighborPage(eq(Category.DEVELOPMENT), eq(1L),
                eq(GraphStatsStore.Side.TAG_A), isNull(), eq(2L), eq(128)))
                .willReturn(firstPage);

        var expansion = graphService.expandTag(Category.DEVELOPMENT, "React", List.of(), 1);

        assertThat(expansion.nodes()).extracting("name").containsExactly("Best");
        assertThat(expansion.hasMore()).isTrue();
        verify(graphStatsStore, never()).neighborPage(eq(Category.DEVELOPMENT), eq(1L),
                eq(GraphStatsStore.Side.TAG_A), eq(new GraphStatsStore.Cursor(2L, 129L)), eq(2L), eq(128));
    }

    @Test
    void asyncExpansionReadsPreparedRankAndSkipsVisibleTags() {
        ReflectionTestUtils.setField(graphService, "asyncEnabled", true);
        given(graphStatsStore.rankedNeighbors(eq(Category.DEVELOPMENT), eq("React"),
                eq(java.util.Set.of("React", "TypeScript")), eq(2)))
                .willReturn(List.of(
                        new GraphStatsStore.RankedNeighbor("Next.js", 5L, 7L, 0.5),
                        new GraphStatsStore.RankedNeighbor("Zod", 3L, 4L, 0.3)));

        var expansion = graphService.expandTag(Category.DEVELOPMENT, "React", List.of("TypeScript"), 1);

        assertThat(expansion.nodes()).extracting("name").containsExactly("Next.js");
        assertThat(expansion.hasMore()).isTrue();
        verify(graphStatsStore, never()).neighborPage(eq(Category.DEVELOPMENT), eq(1L),
                eq(GraphStatsStore.Side.TAG_A), isNull(), eq(2L), eq(128));
    }
}
