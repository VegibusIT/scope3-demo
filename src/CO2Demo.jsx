import { useState, useEffect, useRef } from "react";

export default function CO2Demo() {
  const [tab, setTab] = useState("before");
  const [step, setStep] = useState(0);
  const [truckPos, setTruckPos] = useState(0);
  const [sendProgress, setSendProgress] = useState([0, 0, 0, 0]); // 各社の送信進捗 0~100
  const bottomRef = useRef(null);

  const isBefore = tab === "before";

  useEffect(() => { setStep(0); setTruckPos(0); setSendProgress([0, 0, 0, 0]); }, [tab]);

  // トラック走行
  useEffect(() => {
    if (step !== 1) return;
    if (truckPos >= 100) { setStep(2); return; }
    const t = setTimeout(() => setTruckPos(p => p + 1), 40);
    return () => clearTimeout(t);
  }, [step, truckPos]);

  // 送信アニメーション（上→下）
  useEffect(() => {
    if (step !== 3) return;
    const interval = setInterval(() => {
      setSendProgress(prev => {
        const next = [...prev];
        let allDone = true;
        for (let i = 0; i < 4; i++) {
          // 各社を時間差でスタート
          const delay = i * 20;
          if (next[i] < 100) {
            if (next[i] === 0 && i > 0 && prev[i - 1] < delay) {
              allDone = false;
              continue;
            }
            next[i] = Math.min(next[i] + 2, 100);
            allDone = false;
          }
        }
        if (allDone) {
          clearInterval(interval);
          setTimeout(() => setStep(4), 400);
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [step]);

  // スクロール
  useEffect(() => {
    if (step > 0) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 100);
    }
  }, [step]);

  const next = () => setStep(s => s + 1);
  const reset = () => { setStep(0); setTruckPos(0); setSendProgress([0, 0, 0, 0]); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const companies = [
    { emoji: "🌾", name: "農場", input: "栽培面積・肥料・燃料", co2: 12.4, cooperates: true },
    { emoji: "🚛", name: "物流A", input: "距離・積載率・車種", co2: 15.8, cooperates: false },
    { emoji: "🏭", name: "加工場", input: "電力・冷蔵・廃棄量", co2: 18.5, cooperates: true },
    { emoji: "🚛", name: "物流B", input: "距離・積載率・車種", co2: 15.4, cooperates: false },
  ];

  const totalCo2 = companies.reduce((sum, c) => sum + c.co2, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ValueCycleCode</h1>
            <p className="text-sm text-gray-400 mt-0.5">{isBefore
              ? "見せてください → 見せたくない → 集計できない"
              : "見なくても証明できる → 見なくても集計できる"
            }</p>
          </div>
          <div className="flex rounded-xl bg-gray-100 p-1 shrink-0">
            <button onClick={() => setTab("before")}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                isBefore ? "bg-white text-[#D85A30] shadow-sm" : "text-gray-400"
              }`}>従来</button>
            <button onClick={() => setTab("after")}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                !isBefore ? "bg-white text-[#1D9E75] shadow-sm" : "text-gray-400"
              }`}>hydeの世界</button>
          </div>
        </div>

        {/* ===== Step 0: サプライチェーン全体像 ===== */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">サプライチェーン</h2>
          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
            {companies.map((c, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-1">{c.emoji}</div>
                  <div className="font-bold text-gray-900 text-sm">{c.name}</div>
                </div>
                <div className="text-xl text-gray-300">→</div>
              </div>
            ))}
            <div className="text-center">
              <div className="text-3xl mb-1">🏪</div>
              <div className="font-bold text-gray-900 text-sm">小売</div>
              <div className="text-xs text-gray-400">Scope3集計</div>
            </div>
          </div>
          {step === 0 && (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                この物流の各段階でCO₂が発生する。Scope3ではサプライチェーン全体の排出量を集計する必要がある。
              </p>
              <button onClick={next}
                className={`px-8 py-3 rounded-xl text-sm font-bold text-white cursor-pointer ${
                  isBefore ? "bg-slate-800 hover:bg-slate-700" : "bg-[#1D9E75] hover:bg-[#178a63]"
                }`}>
                配送を開始する →
              </button>
            </div>
          )}
        </div>

        {/* ===== Step 1: 配送中 ===== */}
        {step >= 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">① 配送</h2>
            <div className="flex justify-between items-center px-4 mb-1 text-sm text-gray-400">
              <span>🌾 農場</span><span>🚛</span><span>🏭 加工場</span><span>🚛</span><span>🏪 小売</span>
            </div>
            <div className="relative h-12 bg-gray-50 rounded-xl">
              <div className="absolute top-1/2 left-4 right-4 h-px bg-gray-200 -translate-y-1/2" />
              <div className="absolute top-1/2 -translate-y-1/2 text-2xl"
                style={{ left: `${Math.min(step === 1 ? truckPos : 90, 90)}%`, transition: "none" }}>
                🚛
              </div>
            </div>
            {step === 1 && <p className="text-center text-sm text-gray-400 mt-2">配送中…CO₂が発生しています</p>}
          </div>
        )}

        {/* ===== Step 2: 各社がCO2を入力（平文） ===== */}
        {step >= 2 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">② 各社がCO₂を算出</h2>
            <p className="text-sm text-gray-400 mb-4">各社は自社のCO₂排出量を計算する。この時点では平文（そのままの数値）。</p>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {companies.map((c, i) => (
                <div key={i} className="rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{c.emoji}</span>
                    <span className="font-bold text-gray-900">{c.name}</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">入力: {c.input}</div>
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">算出CO₂（平文）</div>
                    <div className="font-mono font-bold text-2xl text-gray-900">
                      {c.co2}<span className="text-xs font-normal text-gray-400 ml-1">kg</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">👀 この時点では自社だけが見える</div>
                  </div>
                </div>
              ))}
            </div>

            {step === 2 && (
              <div className="text-center">
                <button onClick={next}
                  className={`px-8 py-3 rounded-xl text-sm font-bold text-white cursor-pointer ${
                    isBefore ? "bg-slate-800 hover:bg-slate-700" : "bg-[#1D9E75] hover:bg-[#178a63]"
                  }`}>
                  {isBefore ? "小売に報告する →" : "暗号化して小売に送信する →"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== Step 3: 送信（上→下アニメーション） ===== */}
        {step >= 3 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              ③ {isBefore ? "小売へ報告" : "暗号化して小売へ送信"}
            </h2>
            {!isBefore && (
              <p className="text-sm text-gray-400 mb-4">送信時に自動で暗号化。小売には暗号文だけが届く。</p>
            )}

            <div className="grid grid-cols-4 gap-4">
              {companies.map((c, i) => (
                <div key={i} className="text-center">
                  {/* 送信元（各社） */}
                  <div className={`rounded-xl border p-3 mb-2 ${
                    isBefore ? "border-gray-200" : "border-[#1D9E75]/20"
                  }`}>
                    <div className="text-lg">{c.emoji} {c.name}</div>
                    <div className="font-mono text-sm text-gray-800 mt-1">
                      {c.co2} kg
                    </div>
                  </div>

                  {/* 送信パイプ（上→下） */}
                  <div className="relative h-32 flex justify-center">
                    {/* パイプ背景 */}
                    <div className="w-px h-full bg-gray-200" />

                    {/* 流れるデータ */}
                    {sendProgress[i] > 0 && sendProgress[i] < 100 && (
                      <div className="absolute w-full flex justify-center"
                        style={{ top: `${sendProgress[i]}%`, transform: "translateY(-50%)" }}>
                        <div className={`px-2 py-1 rounded text-xs font-bold text-white ${
                          isBefore ? "bg-gray-700" : "bg-[#1D9E75]"
                        }`}>
                          {isBefore ? `${c.co2} kg` : "🔒"}
                        </div>
                      </div>
                    )}

                    {/* 暗号化ポイント（hydeの場合） */}
                    {!isBefore && (
                      <div className="absolute top-[15%] -translate-y-1/2 flex items-center gap-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          sendProgress[i] > 15 ? "bg-[#1D9E75] text-white" : "bg-gray-100 text-gray-300"
                        }`}>🔐</div>
                        {sendProgress[i] > 15 && (
                          <span className="text-[10px] text-[#1D9E75] font-bold whitespace-nowrap">暗号化</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 送信先（小売） */}
                  <div className={`rounded-xl border p-3 mt-2 ${
                    sendProgress[i] >= 100
                      ? isBefore ? "border-yellow-300 bg-yellow-50" : "border-[#1D9E75]/30 bg-[#1D9E75]/5"
                      : "border-gray-100 bg-gray-50"
                  }`}>
                    <div className="text-xs text-gray-400 mb-1">🏪 小売が受信</div>
                    {sendProgress[i] >= 100 ? (
                      isBefore ? (
                        <div className="font-mono font-bold text-lg text-gray-900">
                          {c.co2} <span className="text-xs font-normal text-gray-400">kg</span>
                        </div>
                      ) : (
                        <div className="text-xl">🔒</div>
                      )
                    ) : (
                      <div className="text-gray-300 text-sm">待機中…</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 受信完了後の小売視点 */}
            {sendProgress.every(p => p >= 100) && (
              <div className={`mt-4 rounded-xl p-4 text-center ${
                isBefore ? "bg-yellow-50 border border-yellow-200" : "bg-[#1D9E75]/5 border border-[#1D9E75]/20"
              }`}>
                <div className="text-sm font-bold text-gray-700 mb-1">🏪 小売が受信したデータ</div>
                {isBefore ? (
                  <div className="text-sm text-yellow-700">
                    ⚠ 全社の実数値が丸見え — {companies.map(c => `${c.name}: ${c.co2}kg`).join("、")}
                  </div>
                ) : (
                  <div className="text-sm text-[#1D9E75]">
                    🔒 暗号文のみ — 個社の数値は小売にも見えない
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== Step 4: 集計 → 結果 ===== */}
        {step >= 4 && (
          <>
            {isBefore ? (
              /* 従来: 拒否 → 集計不可 */
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">④ 報告を求める</h2>
                <p className="text-sm text-gray-400 mb-4">
                  協力してくれる会社もあるが、拒否する会社もある。一社でも欠けると全体集計ができない。
                </p>
                <div className="space-y-3 mb-6 max-w-2xl">
                  {[
                    { ok: true, say: "うちは出せます" },
                    { ok: false, say: "排出量を知られたら運賃交渉で不利になる" },
                    { ok: true, say: "透明性は大事なので協力します" },
                    { ok: false, say: "データ改ざんが心配。責任を負いたくない" },
                  ].map((r, i) => (
                    <div key={i} className={`flex items-start gap-3 p-4 rounded-xl ${
                      r.ok ? "bg-green-50" : "bg-[#D85A30]/5"
                    }`}>
                      <span className="text-lg shrink-0">{companies[i].emoji}</span>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-700">{companies[i].name}</div>
                        <div className="text-sm text-gray-600">「{r.say}」</div>
                      </div>
                      {r.ok ? (
                        <span className="text-green-600 font-bold shrink-0">○ 協力</span>
                      ) : (
                        <span className="text-[#D85A30] font-bold shrink-0">✕ 拒否</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* 結果: 部分的にしか集計できない */}
                <div className="bg-[#D85A30]/5 rounded-xl p-8 text-center">
                  <div className="text-4xl mb-3">😔</div>
                  <div className="text-xl font-bold text-[#D85A30] mb-2">Scope3 集計不完全</div>
                  <p className="text-sm text-gray-500 mb-4">
                    協力企業のデータだけでは全体像が分からない。一社でも欠けるとサプライチェーン全体の算定ができない。
                  </p>
                  <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
                    {companies.map((c, i) => (
                      <div key={i} className={`rounded-xl p-3 text-center border ${
                        c.cooperates ? "bg-white border-green-200" : "bg-white border-[#D85A30]/20"
                      }`}>
                        <div>{c.emoji} {c.name}</div>
                        {c.cooperates ? (
                          <div className="text-green-600 font-bold text-xl">○</div>
                        ) : (
                          <div className="text-[#D85A30] font-bold text-xl">✕</div>
                        )}
                        <div className="text-[10px] text-gray-400">
                          {c.cooperates ? "報告済み" : "拒否"}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    報告率: {companies.filter(c => c.cooperates).length} / {companies.length} 社 → <strong className="text-[#D85A30]">全体集計は不可能</strong>
                  </div>
                </div>
              </div>
            ) : (
              /* hyde: 暗号文のまま集計 → 結果 */
              <div className="space-y-6">
                {/* 技術説明 */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">④ 暗号文のまま集計する</h2>
                  <p className="text-sm text-gray-400 mb-4">
                    ブロックチェーンで10年以上使われてきた暗号技術を組み合わせる
                  </p>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {[
                      { tag: "hyde", color: "#378ADD", icon: "🔐", title: "改ざん防止",
                        text: "センサーがTPMチップで電子署名。データは生まれた瞬間から改ざん不可能。",
                        origin: "TEE — Intel SGX等でブロックチェーンノード保護に使用" },
                      { tag: "argo", color: "#1D9E75", icon: "✓", title: "ゼロ知識証明",
                        text: "数値を見せずに「基準値以下」を数学的に証明。",
                        origin: "ZKP — Zcash(2016年〜)、Ethereum L2で毎日数百万件処理" },
                      { tag: "plat", color: "#7F77DD", icon: "🔒", title: "暗号のまま集計",
                        text: "暗号化されたまま足し算。復号しても合計しか分からない。",
                        origin: "FHE — Web3のプライバシー保護投票で実用化が進む" },
                    ].map((s, i) => (
                      <div key={i} className="rounded-xl border p-5"
                        style={{ borderColor: s.color + "30", backgroundColor: s.color + "05" }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{s.icon}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                            style={{ backgroundColor: s.color }}>{s.tag}</span>
                        </div>
                        <div className="font-bold text-gray-900 mb-1">{s.title}</div>
                        <p className="text-xs text-gray-600 mb-2">{s.text}</p>
                        <div className="text-[10px] text-gray-400 bg-gray-50 rounded p-2">📎 {s.origin}</div>
                      </div>
                    ))}
                  </div>

                  {/* FHE集計の可視化 */}
                  <div className="bg-[#7F77DD]/5 border border-[#7F77DD]/20 rounded-xl p-6">
                    <div className="text-sm font-bold text-gray-700 mb-3 text-center">
                      🔒 暗号文のまま足し算（FHE）
                    </div>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      {companies.map((c, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="bg-[#7F77DD]/10 border-2 border-[#7F77DD] rounded-xl w-16 h-16 flex flex-col items-center justify-center">
                            <div className="text-lg">🔒</div>
                            <div className="text-[8px] text-[#7F77DD]">{c.name}</div>
                          </div>
                          {i < 2 && <span className="text-xl text-[#7F77DD] font-bold">+</span>}
                        </div>
                      ))}
                      <span className="text-xl text-[#7F77DD] font-bold">=</span>
                      <div className="bg-[#7F77DD] rounded-xl w-20 h-16 flex flex-col items-center justify-center text-white shadow-lg shadow-[#7F77DD]/20">
                        <div className="text-lg">🔒</div>
                        <div className="text-[8px]">合計（暗号文）</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 結果 */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
                  <h2 className="text-lg font-bold text-white mb-4">⑤ 結果</h2>
                  <div className="text-center mb-6">
                    <div className="text-sm text-slate-400 mb-1">サプライチェーン CO₂ 集計値</div>
                    <div className="text-6xl font-bold text-[#5EDDA8] my-2">
                      {totalCo2.toFixed(1)}
                      <span className="text-2xl ml-1">kg</span>
                    </div>
                    <div className="text-sm text-slate-400">
                      3社合計 — 基準適合 ✓
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-6">
                    {companies.map((c, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-lg">{c.emoji} {c.name}</div>
                        <div className="text-[#5EDDA8] font-bold text-xl mt-1">✓</div>
                        <div className="text-[10px] text-slate-500 mt-1">個社CO₂: 非公開</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 text-left grid grid-cols-2 gap-2 text-sm text-slate-300 max-w-lg mx-auto">
                    <div>✓ <strong className="text-white">合計値</strong>は分かる</div>
                    <div>✓ <strong className="text-white">個社の内訳</strong>は見えない</div>
                    <div>✓ データは<strong className="text-white">改ざん不可能</strong></div>
                    <div>✓ 全社が<strong className="text-white">安心して参加</strong>できた</div>
                  </div>

                  <div className="text-center mt-6">
                    <button onClick={reset}
                      className="px-5 py-2 rounded-lg text-sm cursor-pointer bg-white/10 text-slate-300 hover:bg-white/20">
                      ↺ 最初から
                    </button>
                  </div>
                </div>

                {/* なぜできるのか — 結果の後に説明 */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">なぜ、数値を見せずに集計できるのか？</h2>
                  <p className="text-sm text-gray-400 mb-6">3つの暗号技術の組み合わせ。すべてブロックチェーンで10年以上の実績がある。</p>

                  <div className="space-y-6">
                    {/* hyde */}
                    <div className="flex gap-4 items-start">
                      <div className="w-14 h-14 rounded-xl bg-[#378ADD] flex items-center justify-center text-white font-bold text-sm shrink-0">hyde</div>
                      <div>
                        <div className="font-bold text-gray-900 mb-1">データが本物であることを保証する</div>
                        <p className="text-sm text-gray-600 mb-2">
                          各社のIoTセンサーに搭載されたTPMチップが、計測した瞬間にデータに電子署名する。
                          Excelに人間が入力するのではなく、<strong>機械が直接署名する</strong>ので、途中で書き換えると署名が壊れて検知できる。
                        </p>
                        <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2">
                          📎 TEE（Trusted Execution Environment）— Intel SGX等でブロックチェーンのノード保護に使われてきた技術
                        </div>
                      </div>
                    </div>

                    {/* argo */}
                    <div className="flex gap-4 items-start">
                      <div className="w-14 h-14 rounded-xl bg-[#1D9E75] flex items-center justify-center text-white font-bold text-sm shrink-0">argo</div>
                      <div>
                        <div className="font-bold text-gray-900 mb-1">数値を見せずに「基準以下」を証明する</div>
                        <p className="text-sm text-gray-600 mb-2">
                          例えば「私の年収は500万以上です」と証明したいとき、給与明細を見せなくても数学的に証明できる技術。
                          同じ原理で、CO₂排出量が<strong>基準値以下であることだけ</strong>を、実数値を見せずに証明する。
                        </p>
                        <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2">
                          📎 ゼロ知識証明（ZKP）— Zcash（2016年〜）やEthereum L2で毎日数百万件処理されている技術
                        </div>
                      </div>
                    </div>

                    {/* plat */}
                    <div className="flex gap-4 items-start">
                      <div className="w-14 h-14 rounded-xl bg-[#7F77DD] flex items-center justify-center text-white font-bold text-sm shrink-0">plat</div>
                      <div>
                        <div className="font-bold text-gray-900 mb-1">暗号化したまま足し算する</div>
                        <p className="text-sm text-gray-600 mb-2">
                          通常、暗号化されたデータを足すには一度復号する必要がある。
                          準同型暗号（FHE）は<strong>暗号文のまま足し算</strong>ができる。
                          復号しても合計値しか分からず、各社の個別データは秘密のまま。
                        </p>
                        <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2">
                          📎 準同型暗号（FHE）— Web3のプライバシー保護投票やオンチェーンオークションで実用化が進む技術
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isBefore && (
              <div className="text-center">
                <button onClick={reset}
                  className="px-5 py-2 rounded-lg text-sm cursor-pointer bg-gray-100 text-gray-500 hover:bg-gray-200">
                  ↺ 最初から
                </button>
              </div>
            )}
          </>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
