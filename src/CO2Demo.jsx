import { useState, useEffect, useRef } from "react";

export default function CO2Demo() {
  const [tab, setTab] = useState("before");
  const [step, setStep] = useState(0);
  const [truckPos, setTruckPos] = useState(0);
  const bottomRef = useRef(null);

  const isBefore = tab === "before";

  useEffect(() => { setStep(0); setTruckPos(0); }, [tab]);

  // トラック走行
  useEffect(() => {
    if (step !== 1) return;
    if (truckPos >= 100) { setStep(2); return; }
    const t = setTimeout(() => setTruckPos(p => p + 1), 40);
    return () => clearTimeout(t);
  }, [step, truckPos]);

  // 新しいステップが出たら下にスクロール
  useEffect(() => {
    if (step > 0) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 100);
    }
  }, [step]);

  const next = () => setStep(s => s + 1);
  const reset = () => { setStep(0); setTruckPos(0); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const companies = [
    { emoji: "🌾", name: "農場", input: "栽培面積・肥料・燃料", co2: "12.4" },
    { emoji: "🏭", name: "加工場", input: "電力・冷蔵・廃棄量", co2: "18.5" },
    { emoji: "🚛", name: "物流", input: "距離・積載率・車種", co2: "31.2" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ===== ヘッダー ===== */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Scope3 CO₂ サプライチェーン可視化</h1>
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

        {/* ===== Step 0: サプライチェーンの全体像 ===== */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">サプライチェーン</h2>
          <div className="flex items-center justify-center gap-8 mb-6">
            {companies.map((c, i) => (
              <div key={i} className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-1">{c.emoji}</div>
                  <div className="font-bold text-gray-900">{c.name}</div>
                  <div className="text-xs text-gray-400">{c.input}</div>
                </div>
                {i < 2 && <div className="text-2xl text-gray-300">→</div>}
              </div>
            ))}
            <div className="text-2xl text-gray-300">→</div>
            <div className="text-center">
              <div className="text-4xl mb-1">🏪</div>
              <div className="font-bold text-gray-900">カスミ</div>
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
              <span>🌾 農場</span><span>🏭 加工場</span><span>🏪 カスミ</span>
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

        {/* ===== Step 2: 各社のCO2データ ===== */}
        {step >= 2 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">② 各社のCO₂排出量</h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {companies.map((c, i) => (
                <div key={i} className={`rounded-xl border p-5 ${
                  isBefore ? "bg-white border-gray-200" : "bg-white border-[#1D9E75]/20"
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{c.emoji}</span>
                    <span className="font-bold text-gray-900">{c.name}</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">入力: {c.input}</div>
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">算出CO₂</div>
                    {isBefore ? (
                      <div className="font-mono font-bold text-2xl text-gray-900">
                        {c.co2}<span className="text-xs font-normal text-gray-400 ml-1">kg</span>
                      </div>
                    ) : (
                      <div className="text-2xl">🔒 <span className="text-xs text-[#1D9E75]">暗号化済み</span></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* カスミから見えるもの */}
            <div className={`rounded-xl p-4 mb-4 ${isBefore ? "bg-yellow-50 border border-yellow-200" : "bg-[#1D9E75]/5 border border-[#1D9E75]/20"}`}>
              <div className="text-sm font-bold text-gray-700 mb-2">🏪 カスミから見えるもの</div>
              <div className="grid grid-cols-3 gap-2">
                {companies.map((c, i) => (
                  <div key={i} className="text-center text-sm">
                    {isBefore ? (
                      <span className="font-mono text-gray-800">{c.name}: <strong>{c.co2} kg</strong></span>
                    ) : (
                      <span className="text-[#1D9E75]">{c.name}: <strong>基準以下 ✓</strong></span>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-xs text-center mt-2 text-gray-400">
                {isBefore ? "⚠ 全社の実数値がカスミに丸見え" : "🔒 数値は見えないが、適合だけ分かる"}
              </div>
            </div>

            {step === 2 && (
              <div className="text-center">
                <button onClick={next}
                  className={`px-8 py-3 rounded-xl text-sm font-bold text-white cursor-pointer ${
                    isBefore ? "bg-slate-800 hover:bg-slate-700" : "bg-[#1D9E75] hover:bg-[#178a63]"
                  }`}>
                  {isBefore ? "Scope3集計を試みる →" : "集計を実行する →"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== Step 3: 報告要求 or 技術 ===== */}
        {step >= 3 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            {isBefore ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-4">③ 「排出量を教えてください」</h2>
                <div className="space-y-3 mb-4 max-w-2xl">
                  {[
                    "企業秘密です。競合に知られたら価格交渉で不利になります。",
                    "うちだけ数値が高く見えたら取引を切られるかもしれない。",
                    "データが改ざんされないか心配。責任を負いたくない。",
                  ].map((reason, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-[#D85A30]/5 rounded-xl">
                      <span className="text-lg shrink-0">{companies[i].emoji}</span>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-700">{companies[i].name}</div>
                        <div className="text-sm text-gray-600">「{reason}」</div>
                      </div>
                      <span className="text-[#D85A30] font-bold shrink-0">✕ 拒否</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-2">③ 数値を見ずに、基準適合を証明する</h2>
                <p className="text-sm text-gray-400 mb-4">ブロックチェーンで10年以上使われてきた暗号技術を組み合わせる</p>
                <div className="grid grid-cols-3 gap-4 mb-4">
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
              </>
            )}

            {step === 3 && (
              <div className="text-center">
                <button onClick={next}
                  className={`px-8 py-3 rounded-xl text-sm font-bold text-white cursor-pointer ${
                    isBefore ? "bg-[#D85A30] hover:bg-[#c04e28]" : "bg-[#1D9E75] hover:bg-[#178a63]"
                  }`}>
                  結果を見る →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== Step 4: 結果 ===== */}
        {step >= 4 && (
          <div className={`rounded-2xl p-8 ${
            isBefore ? "bg-white border border-gray-200" : "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
          }`}>
            {isBefore ? (
              <div className="text-center">
                <h2 className="text-lg font-bold text-gray-900 mb-2">④ 結果</h2>
                <div className="text-4xl mb-3">😔</div>
                <div className="text-xl font-bold text-[#D85A30] mb-2">Scope3 集計不可</div>
                <p className="text-sm text-gray-500 mb-4">
                  「見せてください」と頼む限り、サプライヤーは協力できない。<br />
                  実数値の開示を求めるアプローチには構造的な限界がある。
                </p>
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                  {companies.map((c, i) => (
                    <div key={i} className="bg-[#D85A30]/5 rounded-xl p-3 text-center">
                      <div className="text-lg">{c.emoji} {c.name}</div>
                      <div className="text-[#D85A30] font-bold text-xl">✕</div>
                      <div className="text-[10px] text-gray-400">報告拒否</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-lg font-bold text-white mb-2">④ 結果</h2>
                <div className="text-3xl font-bold text-[#5EDDA8] mb-3">
                  サプライチェーン全体 — 基準適合 ✓
                </div>
                <p className="text-sm text-slate-400 mb-6">
                  CO₂の実数値は誰にも見えていない。それでも集計できた。
                </p>
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
                  {companies.map((c, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                      <div className="text-lg">{c.emoji} {c.name}</div>
                      <div className="text-[#5EDDA8] font-bold text-xl">✓</div>
                      <div className="text-[10px] text-slate-500">CO₂: 非公開</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-left grid grid-cols-2 gap-2 text-sm text-slate-300 max-w-lg mx-auto">
                  <div>✓ 数値を<strong className="text-white">見せずに</strong>証明した</div>
                  <div>✓ 暗号文のまま<strong className="text-white">集計</strong>した</div>
                  <div>✓ データは<strong className="text-white">改ざん不可能</strong></div>
                  <div>✓ 全社が<strong className="text-white">安心して参加</strong>できた</div>
                </div>
              </div>
            )}

            <div className="text-center mt-6">
              <button onClick={reset}
                className={`px-5 py-2 rounded-lg text-sm cursor-pointer ${
                  isBefore ? "bg-gray-100 text-gray-500" : "bg-white/10 text-slate-300"
                }`}>
                ↺ 最初から
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
