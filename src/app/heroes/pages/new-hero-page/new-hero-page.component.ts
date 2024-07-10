import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-hero-page',
  templateUrl: './new-hero-page.component.html',
  styles: ``
})
export class NewHeroPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl('')
  })

  public publishers = [
    { id: 'DC Comics', value: 'DC - Comics' },
    { id: 'Marvel Comics', value: 'Marvel - Comics' },
  ]

  constructor(
    private heroesService: HeroesService,
    private activatedRoute :ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if ( !this.router.url.includes( 'edit' )) return;

    this.activatedRoute.params
    .pipe(
      switchMap(({id}) => this.heroesService.getHeroById( id )),
    ).subscribe( hero => {

      if (!hero) return this.router.navigateByUrl('/');

      this.heroForm.reset( hero );
      return;

    })
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }



  onSubmit():void {

    if( this.heroForm.invalid ) return;
    console.log(({
      formIsValid: this.heroForm.valid,
      value: this.heroForm.value
    }));

    if( this.currentHero.id ) {
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
          // todo: mostrar snackbar
          this.router.navigate(['/heroes/edit', hero.id]);
          this.showSnackbar(`${hero.superhero} updated!`)
        } );

      return;
    }

    this.heroesService.addHero( this.currentHero )
      .subscribe( hero => {
        // todo: mostrar snackbar, y navegar a /heroes/edit/ hero.id
        this.showSnackbar(`${hero.superhero} created!`)

      })
  }

  showSnackbar(message: string):void {
    this.snackBar.open( message, 'done', {
      duration: 2500,
    })
  }
}
