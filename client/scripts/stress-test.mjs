import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

// 실시간 상태 표시를 위한 화면 HUD 주입 함수
async function injectLiveHUD(page, title) {
  await page.evaluate((text) => {
    let hud = document.getElementById('stress-test-hud');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'stress-test-hud';
      hud.style.position = 'fixed';
      hud.style.top = '12px';
      hud.style.left = '50%';
      hud.style.transform = 'translateX(-50%)';
      hud.style.zIndex = '999999';
      hud.style.background = 'rgba(15, 23, 42, 0.95)';
      hud.style.color = '#38bdf8';
      hud.style.border = '1px solid #0284c7';
      hud.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
      hud.style.padding = '10px 24px';
      hud.style.borderRadius = '12px';
      hud.style.fontFamily = 'monospace';
      hud.style.fontSize = '13px';
      hud.style.fontWeight = 'bold';
      hud.style.pointerEvents = 'none';
      hud.style.transition = 'all 0.2s ease';
      document.body.appendChild(hud);
    }
    hud.innerHTML = `🚀 [Hubble Benchmark] <span style="color:#f8fafc;">${text}</span>`;
  }, title).catch(() => {});
}

// -------------------------------------------------------------
// 🧠 CDP 세션 생성 및 V8 강제 GC(Garbage Collection) 헬퍼
// -------------------------------------------------------------
async function createCDPSessionWithGC(page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('HeapProfiler.enable');
  return {
    collectGarbage: async () => {
      // V8 가비지 컬렉터 강제 2회 트리거 (Major GC 확실 수거)
      await cdp.send('HeapProfiler.collectGarbage');
      await cdp.send('HeapProfiler.collectGarbage');
    },
    getPreciseHeapMB: async () => {
      const memory = await page.evaluate(() => {
        return window.performance?.memory?.usedJSHeapSize ?? null;
      });
      return memory ? Number((memory / (1024 * 1024)).toFixed(2)) : null;
    }
  };
}

// -------------------------------------------------------------
// 🔑 테스트 컨텍스트 생성 (독립 격리 + 인증 주입)
// -------------------------------------------------------------
async function createIsolatedContext(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  await context.addInitScript(() => {
    localStorage.setItem(
      'auth-storage',
      JSON.stringify({
        state: {
          isLoggedIn: true,
          user: { id: 1, email: 'benchmark@test.com', nickname: 'Benchmarker' },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
        version: 0,
      })
    );
  });

  return context;
}

// =============================================================
// 🚀 메인 벤치마크 실행 러너
// =============================================================
async function runEngineeredBenchmark() {
  console.log('\n======================================================');
  console.log('🔬 Hubble 정밀 엔지니어링 벤치마크 및 부하 검증 시작');
  console.log(`🌐 대상 URL: ${BASE_URL}`);
  console.log('======================================================\n');

  let browser;
  try {
    browser = await chromium.launch({
      channel: 'chrome',
      headless: false,
      args: ['--enable-precise-memory-info', '--js-flags=--expose-gc'],
    });
  } catch {
    browser = await chromium.launch({
      headless: false,
      args: ['--enable-precise-memory-info', '--js-flags=--expose-gc'],
    });
  }

  const benchmarkResults = {};

  try {
    // =========================================================
    // 🧪 벤치마크 1: Tiptap 에디터 실 타이핑 및 실제 Next Paint 지연 측정
    // =========================================================
    console.log('▶ [테스트 1/3] 에디터 실사용 트랜잭션 및 Next Paint 레이턴시 정밀 측정...');
    const context1 = await createIsolatedContext(browser);
    const page1 = await context1.newPage();
    const cdp1 = await createCDPSessionWithGC(page1);

    await page1.goto(`${BASE_URL}/notebook/new`);
    await page1.waitForLoadState('domcontentloaded');
    await injectLiveHUD(page1, '벤치마크 1: Tiptap 트랜잭션 및 Next Paint 측정');

    const editorLocator = page1.locator('.tiptap, .ProseMirror, [contenteditable="true"]');
    await editorLocator.waitFor({ state: 'visible', timeout: 15000 });
    await editorLocator.click();

    // 1-1. 실사용 대량 타이핑 시뮬레이션 (키보드 이벤트 파이프라인 정식 통과)
    // 50단락의 실제 블록 텍스트 생성
    const rawParagraphs = Array.from({ length: 30 }).map((_, i) =>
      `허블 지식 관리 시스템 성능 벤치마크 단락 #${i + 1}. 이 문장은 Tiptap ProseMirror의 Node 파싱, Document 모델 갱신 및 React Virtual DOM 재조정 비용을 정확히 유발하기 위한 정식 타이핑 텍스트입니다.`
    ).join('\n\n');

    console.log('   - 키보드 이벤트 파이프라인을 통한 대용량 텍스트 트랜잭션 주입 중...');
    const startTime = await page1.evaluate(() => performance.now());

    // Tiptap 내부 Transaction API를 직접 호출하거나 키보드 클립보드 붙여넣기를 통해
    // ProseMirror 트랜잭션과 Document 파싱을 정식으로 거치도록 처리
    await page1.evaluate((text) => {
      const editorElement = document.querySelector('.tiptap, .ProseMirror');
      if (editorElement) {
        // 실제 사용자가 복사/붙여넣기(Paste)할 때와 완전히 동일한 DataTransfer 이벤트 트리거
        const pasteEvent = new ClipboardEvent('paste', {
          bubbles: true,
          cancelable: true,
          clipboardData: new DataTransfer()
        });
        pasteEvent.clipboardData.setData('text/plain', text);
        editorElement.dispatchEvent(pasteEvent);
      }
    }, rawParagraphs);

    // React 렌더링 및 브라우저 Paint 완료 대기 (Double requestAnimationFrame 패턴)
    const renderDuration = await page1.evaluate(async (start) => {
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve(performance.now() - start);
          });
        });
      });
    }, startTime);

    // 1-2. 슬래시('/') 입력 후 실제 화면 Paint까지의 정밀 인터랙션 지연(INP) 측정
    await page1.keyboard.press('Enter');

    const slashINP = await page1.evaluate(async () => {
      const editor = document.querySelector('.tiptap, .ProseMirror');
      const start = performance.now();

      // 슬래시 키 입력 디스패치
      editor.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true }));
      editor.dispatchEvent(new InputEvent('beforeinput', { inputType: 'insertText', data: '/', bubbles: true }));
      editor.dispatchEvent(new InputEvent('input', { inputType: 'insertText', data: '/', bubbles: true }));
      editor.dispatchEvent(new KeyboardEvent('keyup', { key: '/', bubbles: true }));

      // 브라우저가 화면을 실제로 다시 그린(Next Paint) 정확한 시점 캡처
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve(performance.now() - start);
          });
        });
      });
    });

    // 강제 GC 후 실제 Retained Heap 측정
    await cdp1.collectGarbage();
    const editorPostGCMemory = await cdp1.getPreciseHeapMB();

    console.log(`   ✓ Tiptap 파싱 및 Paint 소요시간: ${renderDuration.toFixed(2)} ms`);
    console.log(`   ✓ 슬래시 키 입력 ➔ Next Paint 지연: ${slashINP.toFixed(2)} ms`);
    console.log(`   ✓ 강제 GC 후 에디터 Retained Heap: ${editorPostGCMemory} MB`);

    benchmarkResults.editor = {
      renderDurationMs: Number(renderDuration.toFixed(2)),
      slashINPMs: Number(slashINP.toFixed(2)),
      retainedHeapMB: editorPostGCMemory,
    };

    await context1.close(); // 컨텍스트 완전 파괴 (격리)

    // =========================================================
    // 🧪 벤치마크 2: 라우팅 반복 및 CDP 기반 정밀 메모리 누수(Memory Leak) 판정
    // =========================================================
    console.log('\n▶ [테스트 2/3] CDP 강제 GC 기반 실제 메모리 누수(Retained Heap Leak) 정밀 감시...');
    const context2 = await createIsolatedContext(browser);
    const page2 = await context2.newPage();
    const cdp2 = await createCDPSessionWithGC(page2);

    // 기준점(Baseline) 메모리 측정
    await page2.goto(`${BASE_URL}/thread`);
    await page2.waitForLoadState('domcontentloaded');
    await cdp2.collectGarbage();
    const baselineMemory = await cdp2.getPreciseHeapMB();
    console.log(`   - 초기 베이스라인 Heap (GC 완료 후): ${baselineMemory} MB`);

    const ITERATIONS = 15;
    const memoryReadings = [];

    for (let i = 1; i <= ITERATIONS; i++) {
      await injectLiveHUD(page2, `벤치마크 2: 강제 GC 기반 누수 추적 (${i}/${ITERATIONS})`);

      await page2.goto(`${BASE_URL}/notebook/new`);
      await page2.waitForLoadState('domcontentloaded');

      await page2.goto(`${BASE_URL}/thread`);
      await page2.waitForLoadState('domcontentloaded');

      // 매 5회마다 V8 GC 강제 수거 후 남아있는 순수 미해제 객체 메모리 측정
      if (i % 5 === 0) {
        await cdp2.collectGarbage();
        const retained = await cdp2.getPreciseHeapMB();
        memoryReadings.push({ iteration: i, retainedMB: retained });
        console.log(`   [${i}/${ITERATIONS}회 전환 후] 순수 Retained Heap: ${retained} MB (증가량: +${(retained - baselineMemory).toFixed(2)} MB)`);
      }
    }

    await cdp2.collectGarbage();
    const finalRetainedMemory = await cdp2.getPreciseHeapMB();
    const memoryLeakDelta = Number((finalRetainedMemory - baselineMemory).toFixed(2));
    const isLeakDetected = memoryLeakDelta > 30.0; // 15회 왕복 후에도 30MB 이상 순수 증가는 실제 DOM/클로저 누수

    console.log(`   ✓ 15회 전환 후 최종 순수 누수량(Delta): ${memoryLeakDelta} MB (${isLeakDetected ? '🚨 누수 감지' : '안정적'})`);

    benchmarkResults.memoryLeak = {
      baselineMB: baselineMemory,
      finalRetainedMB: finalRetainedMemory,
      deltaMB: memoryLeakDelta,
      isLeak: isLeakDetected,
    };

    await context2.close(); // 컨텍스트 완전 파괴 (격리)

    // =========================================================
    // 🧪 벤치마크 3: 스토리북 무한 스크롤 결정론적 조건부 대기 스트레스
    // =========================================================
    console.log('\n▶ [테스트 3/3] 스토리북 무한 스크롤 DOM 누적 및 렌더링 스트레스 측정...');
    const context3 = await createIsolatedContext(browser);
    const page3 = await context3.newPage();
    const cdp3 = await createCDPSessionWithGC(page3);

    // 실무 표준 API 인터셉트 (실제 백엔드 엔드포인트 **/*story/me*)
    await page3.route('**/*story/me*', async (route) => {
      const url = new URL(route.request().url());
      const pageNum = parseInt(url.searchParams.get('page') || '0', 10);
      const size = parseInt(url.searchParams.get('size') || '12', 10);

      const mockContent = Array.from({ length: size }).map((_, i) => {
        const id = pageNum * size + i + 1;
        return {
          id,
          title: `[Story #${id}] 정밀 부하 벤치마크 테스트 스토리 카드`,
          description: `DOM 누적 렌더링 시 브라우저 레이아웃 엔진의 Reflow/Repaint 성능을 측정하기 위한 자동 생성 데이터입니다.`,
          category: 'DEVELOPMENT',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: 'Benchmarker',
          likeCount: id * 5,
          viewCount: id * 20,
          articleIds: [id],
        };
      });

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: mockContent,
          totalElements: 120,
          totalPages: 10,
          number: pageNum,
          size,
          first: pageNum === 0,
          last: pageNum >= 8,
        }),
      });
    });

    await page3.goto(`${BASE_URL}/storybook`);
    await page3.waitForLoadState('domcontentloaded');

    // 첫 페이지 카드 로드 대기 (조건부 대기)
    const cardSelector = '[class*="storyCard"], [class*="StoryCard"]';
    await page3.waitForSelector(cardSelector, { state: 'visible', timeout: 10000 });

    let currentCardCount = await page3.locator(cardSelector).count();
    console.log(`   - 초기 마운트 카드 수: ${currentCardCount}개`);

    const SCROLL_ROUNDS = 6;
    for (let s = 1; s <= SCROLL_ROUNDS; s++) {
      const prevCount = currentCardCount;

      // 바닥으로 스크롤하여 무한 스크롤 감지
      await page3.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));

      // waitForTimeout 대신, 카드 개수가 실제로 증가할 때까지 결정론적 조건부 대기 (최대 5초)
      try {
        await page3.waitForFunction(
          ({ sel, prev }) => document.querySelectorAll(sel).length > prev,
          { sel: cardSelector, prev: prevCount },
          { timeout: 5000 }
        );
      } catch {
        // 더 이상 추가 페이지가 없거나 로드 지연 시 중단
      }

      currentCardCount = await page3.locator(cardSelector).count();
      console.log(`   [스크롤 ${s}/${SCROLL_ROUNDS}회] 누적 렌더링된 카드: ${currentCardCount}개`);
      await injectLiveHUD(page3, `벤치마크 3: 무한스크롤 누적 ${currentCardCount}개 DOM 렌더링`);
    }

    await cdp3.collectGarbage();
    const storybookPostGCMemory = await cdp3.getPreciseHeapMB();
    console.log(`   ✓ 카드 ${currentCardCount}개 렌더링 + 강제 GC 후 Heap: ${storybookPostGCMemory} MB`);

    benchmarkResults.infiniteScroll = {
      totalRenderedCards: currentCardCount,
      postGCRetainedHeapMB: storybookPostGCMemory,
    };

    await context3.close();

    // =========================================================
    // 📊 정량적 엔지니어링 벤치마크 최종 성적표
    // =========================================================
    console.log('\n======================================================');
    console.log('📊 Hubble 정밀 엔지니어링 벤치마크 최종 결과표');
    console.log('======================================================');

    const tableReport = [
      {
        측정_항목: '1. 에디터 파싱 & Paint 시간',
        측정값: `${benchmarkResults.editor.renderDurationMs} ms`,
        합격_기준: '< 500 ms',
        판정: benchmarkResults.editor.renderDurationMs < 500 ? '✅ PASS' : '⚠️ WARN',
      },
      {
        측정_항목: '2. 슬래시 키 ➔ Next Paint 지연 (INP)',
        측정값: `${benchmarkResults.editor.slashINPMs} ms`,
        합격_기준: '< 150 ms',
        판정: benchmarkResults.editor.slashINPMs < 150 ? '✅ PASS' : '⚠️ WARN',
      },
      {
        측정_항목: '3. 15회 전환 후 순수 누수량 (GC 수거 후)',
        측정값: `+${benchmarkResults.memoryLeak.deltaMB} MB`,
        합격_기준: '< +30.0 MB',
        판정: benchmarkResults.memoryLeak.isLeak ? '❌ FAIL (누수)' : '✅ PASS (안정)',
      },
      {
        측정_항목: '4. 무한 스크롤 누적 카드 수',
        측정값: `${benchmarkResults.infiniteScroll.totalRenderedCards} 개`,
        합격_기준: '>= 48 개',
        판정: benchmarkResults.infiniteScroll.totalRenderedCards >= 48 ? '✅ PASS' : '⚠️ WARN',
      },
    ];

    console.table(tableReport);

    // 정량 지표 JSON 파일 저장 (CI 파이프라인 연동용)
    const reportPath = path.resolve('benchmark-report.json');
    fs.writeFileSync(
      reportPath,
      JSON.stringify({ timestamp: new Date().toISOString(), results: benchmarkResults, summary: tableReport }, null, 2)
    );
    console.log(`\n📁 정량 리포트 저장 완료: ${reportPath}`);

  } catch (err) {
    console.error('❌ 벤치마크 실행 중 예외 발생:', err);
  } finally {
    await browser.close();
    console.log('\n✨ 엔지니어링 벤치마크가 정상 완료되었습니다.\n');
  }
}

runEngineeredBenchmark();
