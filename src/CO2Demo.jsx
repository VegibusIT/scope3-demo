import { useState, useEffect } from "react";

export default function CO2Demo() {
  const [tab, setTab] = useState("before");
  const [step, setStep] = useState(0);
  // step 0: 配送前
  // step 1: 配送中（トラック走行）
  // step 2: CO2発生
  // step 3: 報告要求
  // step 4: 結果

  const [truckPos, setTruckPos] = useState(0);

  const isBefore = tab === "before";

  // タブ切り替えでリセット
  useEffect(() => {
    setStep(0);
    setTruckPos(0);
  }, [tab]);

  // トラック走行アニメーション
  useEffect(() => {
    if (step !== 1) return;
    if (truckPos >= 100) {
      setTimeout(() => setStep(2), 300);
      return;
    }
    const t = setTimeout(() => setTruckPos(p => p + 4), 25);
    return () => clearTimeout(t);
  }, [step, truckPos]);

  // step 2→3→4 自動進行
  useEffect(() => {
    if (step === 2) {
      const t = setTimeout(() => setStep(3), 1000);
      return () => clearTimeout(t);
    }
    if (step === 3) {
      const t = setTimeout(() => setStep(4), 1500);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* タイトル */}
        <div className="text-center mb-6">
          <h1 className="text-lg font-bold text-gray-900">
            Scope3 CO₂ 可視化
          </h1>
        </div>

        {/* タブ */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
          <button
            onClick={() => setTab("before")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              isBefore ? "bg-white text-[#D85A30] shadow-sm" : "text-gray-400"
            }`}
          >
            従来
          </button>
          <button
            onClick={() => setTab("after")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              !isBefore ? "bg-white text-[#1D9E75] shadow-sm" : "text-gray-400"
            }`}
          >
            hydeの世界
          </button>
        </div>

        {/* メインカード */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

          {/* 物流フロー */}
          <div className="p-5 pb-3">
            <div className="flex justify-between items-center px-2 mb-1">
              <span className="text-lg">🌾</span>
              <span className="text-lg">🏭</span>
              <span className="text-lg">🏪</span>
            </div>
            <div className="flex justify-between items-center px-2 mb-3">
              <span className="text-[10px] text-gray-400">農場</span>
              <span className="text-[10px] text-gray-400">加工</span>
              <span className="text-[10px] text-gray-400">カスミ</span>
            </div>

            {/* 道路 */}
            <div className="relative h-10 bg-gray-50 rounded-lg">
              <div className="absolute top-1/2 left-3 right-3 h-px bg-gray-200 -translate-y-1/2" />

              {step >= 1 && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 text-xl"
                  style={{ left: `${Math.min(truckPos, 88)}%`, transition: "none" }}
                >
                  🚛
                </div>
              )}

              {step === 0 && (
                <button
                  onClick={() => setStep(1)}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white ${
                    isBefore ? "bg-slate-700" : "bg-[#1D9E75]"
                  }`}>
                    ▶ 配送開始
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* CO2データ部分 */}
          {step >= 2 && (
            <div className="px-5 py-3 border-t border-gray-100">
              <div className="text-[10px] text-gray-400 mb-2 text-center">
                各社のCO₂排出量
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["農場", "加工", "物流"].map((name, i) => (
                  <div key={i} className={`text-center p-2 rounded-lg ${
                    isBefore ? "bg-gray-50" : "bg-[#1D9E75]/5"
                  }`}>
                    <div className="text-[10px] text-gray-400">{name}</div>
                    {isBefore ? (
                      <div className="font-mono font-bold text-base text-gray-800">
                        {[12.4, 18.5, 31.2][i]}
                        <span className="text-[10px] font-normal text-gray-400">kg</span>
                      </div>
                    ) : (
                      <div className="text-base">🔒</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 報告・証明フェーズ */}
          {step >= 3 && (
            <div className="px-5 py-3 border-t border-gray-100">
              {isBefore ? (
                /* 従来: 見せてください → 見せたくない */
                <div className="space-y-2">
                  <div className="text-xs text-center text-gray-500 mb-2">
                    「排出量を見せてください」
                  </div>
                  {["企業秘密です", "競合に知られたくない", "改ざんが心配"].map((reason, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-[#D85A30]">✕</span>
                      <span className="text-gray-600">「{reason}」</span>
                    </div>
                  ))}
                </div>
              ) : (
                /* hyde: 見なくても証明できる */
                <div className="space-y-2">
                  <div className="text-xs text-center text-gray-500 mb-2">
                    数値を見ずに証明
                  </div>
                  {[
                    { tag: "hyde", color: "#378ADD", text: "改ざん不可（TPM署名）" },
                    { tag: "argo", color: "#1D9E75", text: "基準以下を証明（ZKP）" },
                    { tag: "plat", color: "#7F77DD", text: "暗号文のまま集計（FHE）" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
                        style={{ backgroundColor: s.color }}>{s.tag}</span>
                      <span className="text-gray-600">{s.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 結果 */}
          {step >= 4 && (
            <div className={`p-5 ${
              isBefore ? "bg-[#D85A30]/5" : "bg-slate-900 text-white"
            }`}>
              {isBefore ? (
                <div className="text-center">
                  <div className="text-2xl mb-1">😔</div>
                  <div className="font-bold text-[#D85A30]">集計できない</div>
                  <div className="text-xs text-gray-500 mt-1">
                    見せてもらえない限り、Scope3は算定できない
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#5EDDA8] mb-1">
                    適合 ✓
                  </div>
                  <div className="text-xs text-slate-400">
                    CO₂の実数値は<strong className="text-white">誰にも見えていない</strong>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    それでも<strong className="text-white">集計できた</strong>
                  </div>
                </div>
              )}

              <div className="text-center mt-3">
                <button
                  onClick={() => { setStep(0); setTruckPos(0); }}
                  className={`px-3 py-1 rounded text-[10px] cursor-pointer ${
                    isBefore ? "bg-gray-100 text-gray-500" : "bg-white/10 text-slate-300"
                  }`}
                >
                  ↺ もう一度
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 一言 */}
        <div className="text-center mt-4 text-xs text-gray-400">
          {isBefore
            ? "見せてください → 見せたくない → 集計できない"
            : "見なくても証明できる → 見なくても集計できる"
          }
        </div>

      </div>
    </div>
  );
}
