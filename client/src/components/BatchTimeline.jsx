import { STAGE_LABELS } from "../utils/constants";

function BatchTimeline({ history }) {
  if (!history || history.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)", fontSize: "13px" }}>
        No downstream transfers recorded yet — this batch is currently held by the origin fisherman.
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Hop</th>
            <th>Stage</th>
            <th>From Address</th>
            <th>To Address</th>
            <th>Settlement Price</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {history.map((transfer, index) => {
            const stageNum = Number(transfer.stageAtTransfer);
            return (
              <tr key={index}>
                <td><strong>#{index + 1}</strong></td>
                <td>
                  <span className={`badge-stage badge-stage-${stageNum}`}>
                    {STAGE_LABELS[stageNum] || `Stage ${stageNum}`}
                  </span>
                </td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                  {transfer.from.slice(0, 8)}...{transfer.from.slice(-6)}
                </td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--primary-blue)" }}>
                  {transfer.to.slice(0, 8)}...{transfer.to.slice(-6)}
                </td>
                <td><strong>₹{Number(transfer.price)}</strong></td>
                <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                  {new Date(Number(transfer.timestamp) * 1000).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default BatchTimeline;
