import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { CountByValues } from "./counter";

export const CounterCommands = createActionGroup({
  source: "Counter Commands",
  events: {
    "Increment the Count": emptyProps(),
    "Decrement the Count": emptyProps(),
    "Reset the Count": emptyProps(),
    "Set Count By": props<{ by: CountByValues }>(),
  },
});
