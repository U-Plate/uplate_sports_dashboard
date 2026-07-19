import type { GoalWeightProjection, WeightEntry } from "../../types";
import { formatLongDate } from "../../lib/date";

/** Half the current-weight marker, so markers at either extreme never clip. */
const INSET = 8;

function lb(value: number): string {
  return value.toFixed(1);
}

/**
 * Where the athlete sits between their first logged weigh-in and their goal.
 *
 * The rail carries the reading: distance travelled and distance left are
 * spatial, so a coach sees the answer before reading a single number. The
 * projected date is a labelled value rather than a sentence, and keeps its
 * caveat attached, per PRODUCT.md's honest-or-absent rule for projections.
 *
 * Colour follows WeightChart next to it: accent for the athlete's own weight,
 * on-track green reserved for marking the goal itself. Neither is a verdict on
 * the athlete.
 */
export function GoalTrack({
  history,
  goalWeightLb,
  currentWeightLb,
  projection,
}: {
  history: WeightEntry[];
  goalWeightLb: number;
  currentWeightLb: number | null;
  projection: GoalWeightProjection;
}) {
  const startWeightLb = history[0]?.weightLb ?? null;
  const current =
    currentWeightLb ?? history[history.length - 1]?.weightLb ?? null;

  if (startWeightLb === null || current === null) {
    return (
      <div className="uplate-goal">
        <ProjectionReadout
          projection={projection}
          goalWeightLb={goalWeightLb}
        />
      </div>
    );
  }

  const remaining = Math.abs(current - goalWeightLb);
  const startGap = Math.abs(startWeightLb - goalWeightLb);

  // A number line, not a progress bar: the goal pins the right edge and every
  // point sits at its true distance from it. An athlete who has moved away
  // lands to the LEFT of where they started, which a clamped 0-100% bar would
  // have flattened into an empty rail.
  const furthest = Math.max(startGap, remaining);
  const position = (weight: number) =>
    furthest === 0 ? 1 : 1 - Math.abs(weight - goalWeightLb) / furthest;

  const startPos = position(startWeightLb);
  const currentPos = position(current);
  const [travelFrom, travelTo] = [
    Math.min(startPos, currentPos),
    Math.max(startPos, currentPos),
  ];

  // Keep markers clear of the rail's rounded ends so nothing clips.
  const atTrack = (fraction: number) =>
    `calc(${INSET}px + (100% - ${INSET * 2}px) * ${fraction})`;

  return (
    <div className="uplate-goal">
      <div className="uplate-goal__track-group">
        <div className="uplate-goal__now">
          <span className="uplate-goal__now-value tnum">{lb(current)} lb</span>
          <span className="uplate-goal__now-gap">
            {remaining < 0.05 ? (
              "at goal weight"
            ) : (
              <>
                <span className="tnum">{lb(remaining)}</span> lb to go
              </>
            )}
          </span>
        </div>

        <div
          className="uplate-goal__track"
          role="img"
          aria-label={`${lb(current)} lb now, ${lb(remaining)} lb from the ${lb(goalWeightLb)} lb goal. Started at ${lb(startWeightLb)} lb.`}
        >
          <div
            className="uplate-goal__travelled"
            style={{
              left: atTrack(travelFrom),
              right: `calc(100% - ${atTrack(travelTo)})`,
            }}
          />
          <div
            className="uplate-goal__start"
            style={{ left: atTrack(startPos) }}
          />
          <div
            className="uplate-goal__marker"
            style={{ left: atTrack(currentPos) }}
          />
          <div
            className="uplate-goal__goal-post"
            style={{ left: atTrack(1) }}
          />
        </div>

        <div className="uplate-goal__legend">
          <span className="uplate-goal__key uplate-goal__key--start">
            Started <span className="tnum">{lb(startWeightLb)}</span> lb
          </span>
          <span className="uplate-goal__key uplate-goal__key--goal">
            Goal <span className="tnum">{lb(goalWeightLb)}</span> lb
          </span>
        </div>
      </div>

      <ProjectionReadout projection={projection} goalWeightLb={goalWeightLb} />
    </div>
  );
}

function ProjectionReadout({
  projection,
  goalWeightLb,
}: {
  projection: GoalWeightProjection;
  goalWeightLb: number;
}) {
  if (projection.kind === "at-goal") {
    return (
      <div className="uplate-goal__eta">
        <span className="uplate-goal__eta-label">Goal weight</span>
        <p className="uplate-goal__eta-value">Reached</p>
        <p className="uplate-goal__eta-caveat">
          Holding around {goalWeightLb} lb across recent weigh-ins.
        </p>
      </div>
    );
  }

  if (projection.kind === "insufficient-data") {
    return (
      <div className="uplate-goal__eta">
        <span className="uplate-goal__eta-label">Projected to reach goal</span>
        <p className="uplate-goal__eta-value uplate-goal__eta-value--pending">
          Not enough weigh-ins
        </p>
        <p className="uplate-goal__eta-caveat">
          A date needs about three weeks of regular weigh-ins to mean anything.
          Check back after a few more.
        </p>
      </div>
    );
  }

  if (projection.kind === "insufficient-trend") {
    return (
      <div className="uplate-goal__eta">
        <span className="uplate-goal__eta-label">Projected to reach goal</span>
        <p className="uplate-goal__eta-value uplate-goal__eta-value--pending">
          No date yet
        </p>
        <p className="uplate-goal__eta-caveat">
          Recent weigh-ins aren't trending toward {goalWeightLb} lb, so any date
          would be a guess.
        </p>
      </div>
    );
  }

  return (
    <div className="uplate-goal__eta">
      <span className="uplate-goal__eta-label">Projected to reach goal</span>
      <p className="uplate-goal__eta-value">
        <span className="uplate-goal__eta-approx">around</span>{" "}
        {formatLongDate(projection.projectedDate)}
      </p>
      <p className="uplate-goal__eta-caveat">
        Estimate from the last three weeks, at about{" "}
        <span className="tnum">
          {Math.abs(projection.weeklyRateLb).toFixed(1)}
        </span>{" "}
        lb a week.
      </p>
    </div>
  );
}
