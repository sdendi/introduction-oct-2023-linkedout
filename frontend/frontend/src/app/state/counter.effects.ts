import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, mergeMap, tap } from "rxjs";
import { CounterCommands } from "./counter.actions";
import { CounterFeature } from "./counter";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CounterEffects {
  logIt$ = createEffect(
    () =>
      this.actions$.pipe(
        tap((a) => console.log(`Got an action of type ${a.type}`))
      ),
    { dispatch: false }
  );

  logCounter$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CounterCommands.incrementTheCount,
          CounterCommands.decrementTheCount,
          CounterCommands.resetTheCount,
          CounterCommands.setCountBy
        ), // if itisn't one of these, forget it about it. "filter"
        concatLatestFrom(() =>
          this.store.select(CounterFeature.selectCounterFeatureState)
        ),
        map(([_, data]) => data), // => data
        mergeMap((data) =>
          this.client
            .post("http://localhost:1338/user/counter", data)
            .pipe(tap(() => console.log("Sent it to the server")))
        )
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly client: HttpClient
  ) {}
}
