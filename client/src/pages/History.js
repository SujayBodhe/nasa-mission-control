
import { useMemo, useState } from "react";
import { Appear, Table, Paragraph } from "arwes";

const History = props => {
  const [currentPage, setCurrentPage] = useState(1);

  const launchesPerPage = 10;

  // Filter historical launches
  const historicalLaunches = useMemo(() => {
    return props.launches?.filter(
      launch => !launch.upcoming
    ) || [];
  }, [props.launches]);

  // Calculate pagination
  const totalPages = Math.max(
    1,
    Math.ceil(historicalLaunches.length / launchesPerPage)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * launchesPerPage;
  const endIndex = startIndex + launchesPerPage;

  // Get launches for current page
  const currentLaunches = historicalLaunches.slice(
    startIndex,
    endIndex
  );

  // Render table rows
  const tableBody = currentLaunches.map(launch => (
    <tr key={launch.id || String(launch.flightNumber)}>
      <td>
        <span style={{
          color: launch.success ? "greenyellow" : "red"
        }}>█</span>
      </td>
      <td>{launch.flightNumber ?? "—"}</td>
      <td>{new Date(launch.launchDate).toDateString()}</td>
      <td>{launch.mission}</td>
      <td>{launch.rocket}</td>
      <td>{launch.launchSite || "Unknown"}</td>
    </tr>
  ));

  return (
    <article id="history">
      <Appear animate show={props.entered}>
        <Paragraph>
          History of SpaceX mission launches.
        </Paragraph>

        {props.isLoading && (
          <Paragraph>Loading SpaceX launch history...</Paragraph>
        )}

        {props.error && (
          <Paragraph>
            Unable to load SpaceX history: {props.error}
          </Paragraph>
        )}

        {!props.isLoading && !props.error && (
          <>
            <Table animate>
              <table style={{ tableLayout: "fixed" }}>
                <thead>
                  <tr>
                    <th style={{ width: "2rem" }}></th>
                    <th style={{ width: "3rem" }}>No.</th>
                    <th style={{ width: "9rem" }}>Date</th>
                    <th>Mission</th>
                    <th style={{ width: "7rem" }}>Rocket</th>
                    <th>Launch Site</th>
                  </tr>
                </thead>
                <tbody>{tableBody}</tbody>
              </table>
            </Table>

            {/* Pagination */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "24px",
              marginBottom: "12px",
            }}>

              {/* Previous button */}
              <button
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage(safeCurrentPage - 1)}
                style={{
                  padding: "8px 14px",
                  background: "rgba(0, 255, 255, 0.04)",
                  border: "1px solid rgba(0, 255, 255, 0.4)",
                  color: safeCurrentPage === 1 ? "#555" : "#00ffff",
                  cursor: safeCurrentPage === 1 ? "not-allowed" : "pointer",
                  opacity: safeCurrentPage === 1 ? 0.4 : 1,
                  fontFamily: "inherit",
                  letterSpacing: "1px",
                  fontSize: "12px",
                }}
              >
                {"< PREV"}
              </button>

              {/* Page numbers */}
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map(page => {
                const isActive = page === safeCurrentPage;

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={isActive}
                    style={{
                      minWidth: "34px",
                      height: "34px",
                      padding: "0 8px",
                      background: isActive
                        ? "rgba(0, 255, 255, 0.18)"
                        : "rgba(0, 255, 255, 0.02)",
                      border: isActive
                        ? "1px solid #00ffff"
                        : "1px solid rgba(0, 255, 255, 0.25)",
                      color: isActive ? "#00ffff" : "#a0caca",
                      cursor: isActive ? "default" : "pointer",
                      boxShadow: isActive
                        ? "0 0 10px rgba(0, 255, 255, 0.25)"
                        : "none",
                      fontFamily: "inherit",
                      fontSize: "13px",
                      fontWeight: isActive ? "bold" : "normal",
                    }}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next button */}
              <button
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage(safeCurrentPage + 1)}
                style={{
                  padding: "8px 14px",
                  background: "rgba(0, 255, 255, 0.04)",
                  border: "1px solid rgba(0, 255, 255, 0.4)",
                  color: safeCurrentPage === totalPages ? "#555" : "#00ffff",
                  cursor: safeCurrentPage === totalPages ? "not-allowed" : "pointer",
                  opacity: safeCurrentPage === totalPages ? 0.4 : 1,
                  fontFamily: "inherit",
                  letterSpacing: "1px",
                  fontSize: "12px",
                }}
              >
                {"NEXT >"}
              </button>

            </div>

            {/* Page information */}
            <div style={{
              textAlign: "center",
              color: "#8daaaa",
              fontSize: "11px",
              letterSpacing: "1px",
              marginBottom: "12px",
            }}>
              PAGE {safeCurrentPage} OF {totalPages}
              {"  |  "}
              SHOWING {historicalLaunches.length === 0 ? 0 : startIndex + 1}
              {" - "}
              {Math.min(endIndex, historicalLaunches.length)}
              {" OF "}
              {historicalLaunches.length} LAUNCHES
            </div>
          </>
        )}
      </Appear>
    </article>
  );
};

export default History;
