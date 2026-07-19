import { useId, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Meal } from '../../types';

/** "55g protein · 40g carbs · 33g fat", separators bound to the preceding word
 *  (U+00A0) so a wrapped line never begins with a stray middot. */
function macroBreakdown(meal: Meal): string {
  return [`${meal.proteinG}g protein`, `${meal.carbsG}g carbs`, `${meal.fatG}g fat`].join(' · ');
}

function amount(value: number, unit: string): string {
  return `${value}${unit}`;
}

/** Sub-gram nutrients keep one decimal so a column never mixes "5 g" with
 *  "8.1 g" and reads as sloppy rounding. */
function fine(value: number, unit: string): string {
  return `${value.toFixed(1)}${unit}`;
}

/**
 * A logged food, expanding in place to its full nutrition panel.
 *
 * Inline disclosure rather than a modal or a route: the coach is scanning a
 * day's meals, and losing that list to open one food would cost them their
 * place for no gain.
 */
export function MealRow({ meal }: { meal: Meal }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="uplate-meal">
      <button
        type="button"
        className="uplate-meal__summary"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronRight
          size={15}
          strokeWidth={2}
          aria-hidden
          className="uplate-meal__chevron"
          data-open={open}
        />
        <span className="uplate-meal__identity">
          <span className="uplate-meal__name">{meal.name}</span>
          <span className="uplate-meal__time">{meal.time}</span>
        </span>
        <span className="uplate-meal__values">
          <span className="uplate-meal__calories tnum">{meal.calories} cal</span>
          <span className="uplate-meal__macros tnum">{macroBreakdown(meal)}</span>
        </span>
      </button>

      {open && (
        <div id={panelId} className="uplate-nutrition">
          <p className="uplate-nutrition__serving">
            Per serving · <span className="tnum">{meal.nutrition.servingSize}</span>
          </p>

          <dl className="uplate-nutrition__grid">
            <NutrientGroup
              label="Calories"
              rows={[
                ['Total', amount(meal.calories, ' cal')],
                ['From fat', amount(meal.nutrition.caloriesFromFat, ' cal')],
              ]}
            />
            <NutrientGroup
              label="Fat"
              rows={[
                ['Total', amount(meal.fatG, ' g')],
                ['Saturated', fine(meal.nutrition.saturatedFatG, ' g')],
                ['Cholesterol', amount(meal.nutrition.cholesterolMg, ' mg')],
              ]}
            />
            <NutrientGroup
              label="Carbohydrates"
              rows={[
                ['Total', amount(meal.carbsG, ' g')],
                ['Fiber', fine(meal.nutrition.dietaryFiberG, ' g')],
                ['Sugar', fine(meal.nutrition.sugarG, ' g')],
                ['Added sugars', fine(meal.nutrition.addedSugarsG, ' g')],
              ]}
            />
            <NutrientGroup
              label="Protein & minerals"
              rows={[
                ['Protein', amount(meal.proteinG, ' g')],
                ['Sodium', amount(meal.nutrition.sodiumMg, ' mg')],
                ['Calcium', amount(meal.nutrition.calciumMg, ' mg')],
                ['Iron', fine(meal.nutrition.ironMg, ' mg')],
              ]}
            />
          </dl>

          {meal.nutrition.labels.length > 0 && (
            <div className="uplate-nutrition__labels">
              {meal.nutrition.labels.map((label) => (
                <span key={label} className="uplate-nutrition__label">
                  {label}
                </span>
              ))}
            </div>
          )}

          <div className="uplate-nutrition__ingredients">
            <span className="uplate-nutrition__group-label">Ingredients</span>
            <p>{meal.nutrition.ingredients}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function NutrientGroup({ label, rows }: { label: string; rows: [string, string][] }) {
  return (
    <div className="uplate-nutrition__group">
      <span className="uplate-nutrition__group-label">{label}</span>
      {rows.map(([name, value]) => (
        <div key={name} className="uplate-nutrition__row">
          <dt>{name}</dt>
          <dd className="tnum">{value}</dd>
        </div>
      ))}
    </div>
  );
}
