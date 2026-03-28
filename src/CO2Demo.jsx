import { useState, useEffect } from "react";

// --- データ（co2の実数値は画面に表示しない）---
const suppliers = [
  { name: "農場A", product: "トマト", co2: 12.4, certified: true },
  { name: "農場B", product: "レタス", co2: 8.1, certified: true },
  { name: "物流C", product: "冷蔵輸送", co2: 31.2, certified: false },
  { name: "農場D", product: "いちご", co2: 9.8, certified: true },
  { name: "加工E", product: "カット野菜", co2: 18.5, certified: true },
];

// サプライヤーの拒否理由
const refusalReasons = [
  "CO2排出量は企業秘密です",
  "競合に知られたくありません",
  "データ精度に自信がないので…",
  "うちだけ悪く見えるのが怖い",
  "改ざんされないか心配です",
];

// --- 幕1: Problem ---
function Act1({ onNext }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (visibleCount < suppliers.length) {
      const timer = setTimeout(() => setVisibleCount((c) => c + 1), 600);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowSummary(true), 800);
      return () => clearTimeout(timer);
    }
  }, [visibleCount]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 bg-[#D85A30]/10 text-[#D85A30] rounded-full text-sm font-medium mb-3">
          幕1 / 3
        </span>
        <h2 className="text-2xl font-bold text-gray-900">
          なぜ、Scope3は集計できなかったのか
        </h2>
        <p className="text-gray-500 mt-2">
          サプライヤーにCO2排出量の報告を依頼した結果
        </p>
      </div>

      <div className="space-y-3 max-w-lg mx-auto">
        {suppliers.map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-4 bg-white rounded-xl border transition-all duration-500 ${
              i < visibleCount
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="flex-1">
              <div className="font-medium text-gray-900">{s.name}</div>
              <div className="text-sm text-gray-500">{s.product}</div>
            </div>

            <div className="text-right">
              <div className="text-sm font-mono text-gray-300 line-through">
                CO2: ???
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#D85A30]/10 flex items-center justify-center text-[#D85A30] text-lg">
              ✕
            </div>

            {i < visibleCount && (
              <div
                className="absolute right-0 translate-x-full ml-2 bg-[#D85A30]/90 text-white text-xs px-3 py-1.5 rounded-lg max-w-48 hidden md:block"
                style={{
                  position: "relative",
                  transform: "none",
                  marginLeft: "0.5rem",
                }}
              >
                {refusalReasons[i]}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* モバイル向け拒否理由 */}
      <div className="md:hidden space-y-2 max-w-lg mx-auto">
        {suppliers.slice(0, visibleCount).map((_, i) => (
          <div key={i} className="text-sm text-[#D85A30] bg-[#D85A30]/5 px-3 py-2 rounded-lg">
            💬 {suppliers[i].name}: 「{refusalReasons[i]}」
          </div>
        ))}
      </div>

      {showSummary && (
        <div className="bg-[#D85A30]/5 border border-[#D85A30]/20 rounded-xl p-6 max-w-lg mx-auto text-center animate-fade-in">
          <div className="text-4xl mb-3">😔</div>
          <div className="text-lg font-bold text-[#D85A30]">
            報告率: 0 / 5 社
          </div>
          <p className="text-gray-600 mt-2 text-sm">
            実数値の開示を求める限り、サプライヤーは協力できない。
            <br />
            これが2年前にぶつかった壁でした。
          </p>

          <button
            onClick={onNext}
            className="mt-4 px-6 py-2.5 bg-[#378ADD] text-white rounded-lg font-medium hover:bg-[#2a6db8] transition-colors cursor-pointer"
          >
            解決策を見る →
          </button>
        </div>
      )}
    </div>
  );
}

// --- 幕2: Solution ---
function Act2({ onNext, onPrev }) {
  const [activeWall, setActiveWall] = useState(0);
  const [animPhase, setAnimPhase] = useState(0);

  useEffect(() => {
    setAnimPhase(0);
    const t1 = setTimeout(() => setAnimPhase(1), 400);
    const t2 = setTimeout(() => setAnimPhase(2), 1000);
    const t3 = setTimeout(() => setAnimPhase(3), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [activeWall]);

  const walls = [
    {
      id: "argo",
      label: "壁1: 実数値を出せない",
      tech: "argo（ゼロ知識証明）",
      color: "#1D9E75",
      icon: "✓",
      desc: "サプライヤーのCO2排出量を誰にも見せずに、「基準値以下である」ことだけを数学的に証明します。",
      howItWorks:
        "値そのものではなく「条件を満たしている証拠」だけを提出。審査員でも数値は見えません。",
      visual: (phase) => (
        <div className="flex items-center justify-center gap-3 py-6">
          {["農場A", "農場B", "農場D"].map((name, i) => (
            <div key={i} className="text-center">
              <div
                className={`w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl transition-all duration-500 ${
                  phase > i
                    ? "bg-[#1D9E75]/10 border-2 border-[#1D9E75]"
                    : ""
                }`}
              >
                {phase > i ? (
                  <span className="text-[#1D9E75]">✓</span>
                ) : (
                  <span className="text-gray-300">???</span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">{name}</div>
              {phase > i && (
                <div className="text-xs text-[#1D9E75] font-medium">
                  基準適合
                </div>
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "hyde",
      label: "壁2: 改ざんを防げない",
      tech: "hyde（ハードウェア信頼基盤）",
      color: "#378ADD",
      icon: "🔒",
      desc: "IoTセンサーとTPMチップが計測値に電子署名。データが生まれた瞬間から改ざんが不可能になります。",
      howItWorks:
        "人間がExcelに入力するのではなく、計測機器が直接署名つきデータを生成。途中で書き換えると署名が壊れます。",
      visual: (phase) => (
        <div className="flex items-center justify-center gap-2 py-6">
          <div
            className={`transition-all duration-500 ${
              phase >= 1 ? "opacity-100" : "opacity-30"
            }`}
          >
            <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
              🌡️
            </div>
            <div className="text-xs text-center text-gray-500 mt-1">
              センサー
            </div>
          </div>

          <div
            className={`text-2xl transition-all duration-500 ${
              phase >= 2 ? "text-[#378ADD]" : "text-gray-300"
            }`}
          >
            →
          </div>

          <div
            className={`transition-all duration-500 ${
              phase >= 2 ? "opacity-100" : "opacity-30"
            }`}
          >
            <div className="w-14 h-14 bg-[#378ADD]/10 border-2 border-[#378ADD] rounded-lg flex items-center justify-center text-xl">
              🔐
            </div>
            <div className="text-xs text-center text-[#378ADD] font-medium mt-1">
              TPM署名
            </div>
          </div>

          <div
            className={`text-2xl transition-all duration-500 ${
              phase >= 3 ? "text-[#378ADD]" : "text-gray-300"
            }`}
          >
            →
          </div>

          <div
            className={`transition-all duration-500 ${
              phase >= 3 ? "opacity-100" : "opacity-30"
            }`}
          >
            <div className="w-14 h-14 bg-green-50 border-2 border-green-400 rounded-lg flex items-center justify-center text-sm font-bold text-green-700">
              Signed
              <br />
              by TEE
            </div>
            <div className="text-xs text-center text-green-600 font-medium mt-1">
              改ざん不可
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "plat",
      label: "壁3: 暗号化したまま集計できない",
      tech: "plat（準同型暗号）",
      color: "#7F77DD",
      icon: "🔢",
      desc: "データを暗号化したまま足し算・集計ができます。誰も中身を見ずに、合計だけが分かります。",
      howItWorks:
        "各社の暗号文を足すと、合計値の暗号文が出る。復号しても合計しか分からず、個社データは秘密のまま。",
      visual: (phase) => (
        <div className="flex items-center justify-center gap-2 py-6 flex-wrap">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`transition-all duration-500 ${
                phase >= 1 ? "opacity-100 scale-100" : "opacity-30 scale-90"
              }`}
            >
              <div className="w-14 h-14 bg-[#7F77DD]/10 border-2 border-[#7F77DD] rounded-lg flex items-center justify-center text-xl">
                🔒
              </div>
            </div>
          ))}

          <div
            className={`text-2xl font-bold transition-all duration-500 ${
              phase >= 2 ? "text-[#7F77DD]" : "text-gray-300"
            }`}
          >
            =
          </div>

          <div
            className={`transition-all duration-500 ${
              phase >= 3 ? "opacity-100 scale-100" : "opacity-30 scale-90"
            }`}
          >
            <div className="w-14 h-14 bg-[#7F77DD] rounded-lg flex items-center justify-center text-xl">
              🔒
            </div>
            <div className="text-xs text-center text-[#7F77DD] font-medium mt-1">
              合計（暗号文）
            </div>
          </div>
        </div>
      ),
    },
  ];

  const wall = walls[activeWall];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium mb-3">
          幕2 / 3
        </span>
        <h2 className="text-2xl font-bold text-gray-900">
          3つの壁を、3つの技術で突破する
        </h2>
      </div>

      {/* タブ */}
      <div className="flex gap-2 justify-center flex-wrap">
        {walls.map((w, i) => (
          <button
            key={i}
            onClick={() => setActiveWall(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeWall === i
                ? "text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={
              activeWall === i ? { backgroundColor: w.color } : undefined
            }
          >
            {w.label}
          </button>
        ))}
      </div>

      {/* コンテンツ */}
      <div
        className="bg-white rounded-2xl border p-6 max-w-xl mx-auto"
        style={{ borderColor: wall.color + "40" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className="px-2 py-0.5 rounded text-xs font-bold text-white"
            style={{ backgroundColor: wall.color }}
          >
            {wall.id}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {wall.tech}
          </span>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed">{wall.desc}</p>

        {/* ビジュアル */}
        {wall.visual(animPhase)}

        <div className="bg-gray-50 rounded-lg p-3 mt-2">
          <div className="text-xs text-gray-400 mb-1">仕組み</div>
          <p className="text-sm text-gray-600">{wall.howItWorks}</p>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={onPrev}
          className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
        >
          ← 戻る
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-[#1D9E75] text-white rounded-lg font-medium hover:bg-[#178a63] transition-colors cursor-pointer"
        >
          結果を見る →
        </button>
      </div>
    </div>
  );
}

// --- 幕3: Result ---
function Act3({ onPrev }) {
  const [showScore, setShowScore] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  const certifiedSuppliers = suppliers.filter((s) => s.certified);

  useEffect(() => {
    if (revealedCount < certifiedSuppliers.length) {
      const timer = setTimeout(
        () => setRevealedCount((c) => c + 1),
        500
      );
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowScore(true), 800);
      return () => clearTimeout(timer);
    }
  }, [revealedCount, certifiedSuppliers.length]);

  // 適合率（certified / total）
  const complianceRate = Math.round(
    (certifiedSuppliers.length / suppliers.length) * 100
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 bg-[#1D9E75]/10 text-[#1D9E75] rounded-full text-sm font-medium mb-3">
          幕3 / 3
        </span>
        <h2 className="text-2xl font-bold text-gray-900">
          実数値なしで、Scope3を集計できた
        </h2>
        <p className="text-gray-500 mt-2">
          カスミのサプライチェーン全体の基準適合状況
        </p>
      </div>

      {/* サプライヤー証明書 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
        {suppliers.map((s, i) => {
          const isRevealed = i < revealedCount || !s.certified;
          const isCertified = s.certified;
          return (
            <div
              key={i}
              className={`p-4 rounded-xl border transition-all duration-500 ${
                isRevealed
                  ? isCertified
                    ? "bg-[#1D9E75]/5 border-[#1D9E75]/30"
                    : "bg-[#D85A30]/5 border-[#D85A30]/30"
                  : "opacity-30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.product}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  {isCertified ? (
                    <>
                      <span className="text-[#1D9E75] text-lg">✓</span>
                      <span className="text-xs text-[#1D9E75] font-medium">
                        適合
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[#D85A30] text-lg">⚠</span>
                      <span className="text-xs text-[#D85A30] font-medium">
                        未証明
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* 技術バッジ */}
              {isCertified && isRevealed && (
                <div className="flex gap-1 mt-2">
                  <span className="text-[10px] px-1.5 py-0.5 bg-[#1D9E75]/10 text-[#1D9E75] rounded font-medium">
                    ZKP証明済
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-[#378ADD]/10 text-[#378ADD] rounded font-medium">
                    TEE署名
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-[#7F77DD]/10 text-[#7F77DD] rounded font-medium">
                    FHE集計
                  </span>
                </div>
              )}

              {/* CO2値は表示しない — これがZKPの意味 */}
              {isCertified && isRevealed && (
                <div className="text-xs text-gray-400 mt-2 italic">
                  CO2排出量: 非公開（証明のみ）
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* スコアダッシュボード */}
      {showScore && (
        <div className="bg-white rounded-2xl border border-[#1D9E75]/20 p-6 max-w-xl mx-auto text-center">
          <div className="text-sm text-gray-500 mb-2">
            サプライチェーン基準適合スコア
          </div>

          <div className="text-6xl font-bold text-[#1D9E75] mb-2">
            {complianceRate}%
          </div>

          <div className="text-sm text-gray-500">
            {certifiedSuppliers.length} / {suppliers.length} 社が基準適合を証明
          </div>

          {/* バー */}
          <div className="w-full bg-gray-100 rounded-full h-3 mt-4 overflow-hidden">
            <div
              className="h-full bg-[#1D9E75] rounded-full transition-all duration-1000"
              style={{ width: `${complianceRate}%` }}
            />
          </div>

          <div className="mt-4 bg-[#1D9E75]/5 rounded-lg p-4 text-left">
            <div className="text-sm font-medium text-[#1D9E75] mb-1">
              何が起きたか
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                ✓ 各社のCO2排出量は<strong>誰にも見えていない</strong>
              </li>
              <li>
                ✓ それでも「基準以下である」ことが<strong>数学的に証明</strong>
                された
              </li>
              <li>
                ✓ 暗号化されたまま集計され、<strong>合計の適合率だけ</strong>
                が出た
              </li>
              <li>✓ データは改ざん不可能（ハードウェア署名済み）</li>
            </ul>
          </div>

          <div className="mt-4 text-xs text-gray-400">
            物流C社は未証明のため、対応依頼を送信できます
          </div>
        </div>
      )}

      <div className="flex justify-center gap-3">
        <button
          onClick={onPrev}
          className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
        >
          ← 戻る
        </button>
      </div>
    </div>
  );
}

// --- メインコンポーネント ---
export default function CO2Demo() {
  const [act, setAct] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Scope3 サプライチェーンCO2可視化
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            hyde + argo + plat によるプライバシー保護型排出量証明
          </p>

          {/* プログレスバー */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    n === act
                      ? "bg-[#378ADD] text-white"
                      : n < act
                      ? "bg-[#1D9E75] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {n < act ? "✓" : n}
                </div>
                {n < 3 && (
                  <div
                    className={`w-12 h-0.5 ${
                      n < act ? "bg-[#1D9E75]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 各幕 */}
        {act === 1 && <Act1 onNext={() => setAct(2)} />}
        {act === 2 && (
          <Act2 onNext={() => setAct(3)} onPrev={() => setAct(1)} />
        )}
        {act === 3 && <Act3 onPrev={() => setAct(2)} />}
      </div>
    </div>
  );
}
