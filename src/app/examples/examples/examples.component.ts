import { Store, select } from '@ngrx/store';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { routeAnimations, selectAuth } from '@app/core';
import { State as BaseSettingsState } from '@app/settings';

import { State as BaseExamplesState } from '../examples.state';
import { DataService } from '../gears/data.service';
import { Logo } from '../crud/logos.model';

import { Jeu, JeuState } from '../authenticated/jeu.model';

import { Logos_KEY } from '../../examples/crud/logos.effects';
import { ActionLogosUpsertAll } from '../crud/logos.actions';
import {
  ActionJeuUpsertOneCarte,
  ActionJeuUpsertAllCartesFromFirebase
} from '../authenticated/jeu.actions';
import { ActionVoteUpsertAll } from '../crud/vote.actions';

interface State extends BaseSettingsState, BaseExamplesState {}

@Component({
  selector: 'anms-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
  animations: [routeAnimations]
})
export class ExamplesComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;


  entitiesLogo$: Observable<any[]>;
  subscription: Subscription;
  subscription2: Subscription;

  examples = [
    { link: 'crud', label: 'Liste des Logos', auth: true },
    { link: 'gears', label: 'Logo Battle', auth: true }
  ];

  key: string = Logos_KEY;
  votes$: Observable<any>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store<State>,
    private dataS: DataService
  ) {
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
    this.votes$ = this.dataS.fireStoreVotes();
    this.subscription2 = this.votes$.subscribe((votes: any) => {
      //console.log("fireStoreVotes")
      //console.log(votes)
      this.store.dispatch(
        new ActionVoteUpsertAll({ votes: votes })
      );
    });
    this.subscription = null;
    this.changeEntityLogo();
    /*
    const inter1 = setInterval(() => {
      if (dataS.logoKey) {
        dataS.logoKey.subscribe(key => {
          //console.log('key');
          //console.log(key);
          this.key = key;
          this.changeEntityLogo();
        });
        clearInterval(inter1);
      }
    }, 1000);
    */
  }

  changeEntityLogo() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.entitiesLogo$ = this.dataS.fireStoreLogoObs(this.key);
    this.subscription = this.entitiesLogo$.subscribe((logos: Logo[]) => {
      //console.log('new fireStoreObservable logos');
      //console.log(logos);
      this.store.dispatch(new ActionLogosUpsertAll({ logos: logos }));
    });
    this.changeDetectorRef.markForCheck();
  }

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(
      select(selectAuth),
      map(auth => auth.isAuthenticated)
    );
  }
}
