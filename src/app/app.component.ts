import { Component } from '@angular/core';
import {transition, trigger, useAnimation} from "@angular/animations";
import { bounce, flip, heartBeat, pulse, rubberBand, shakeX, shakeY, zoomOutUp } from 'ng-animate';
import { lastValueFrom, timer } from 'rxjs';

const DEATH_DURATION_SECONDS = 0.5
const ATTACK_DURATION_SECONDS = 0.3
const ATTACK_SCALE = 4.5

const BONCE = 1
const SHAKE = 0.75
const FLIP = 0.75

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
  trigger("death", [
    transition(
      ":increment",
      useAnimation(shakeX, { params: { timing: DEATH_DURATION_SECONDS } })
    ),
  ]),
 trigger('attack', [
      transition(':increment', [
        useAnimation( rubberBand, { params: { timing: 0.2 } }),
        useAnimation(pulse, { params: { timing: ATTACK_DURATION_SECONDS, scale: ATTACK_SCALE } }),
      ]),
    ]),
  trigger("b", [
    transition(":increment", useAnimation(bounce, { params: { timing: BONCE } })),
  ]),
  trigger("s", [
    transition(":increment", useAnimation(shakeX, { params: { timing: SHAKE } })),
  ]),
  trigger("f", [
    transition(":increment", useAnimation(flip, { params: { timing: FLIP } })),
  ]),

]
})
export class AppComponent {
  slimeIsPresent = false;
  ng_death = 0;
  ng_attack = 0;
  ng_b = 0;
  ng_s = 0;
  ng_f = 0;
  css_hit = false;
  css_rotateCenter = false;
  css_rotateHorTop = false;
  keepPlayingAnimation = false;
  isPlaying = false;


  constructor() {
  }

  showSlime(){
    var element = document.getElementById("slimeyId");
    element?.classList.remove("fadeOut");
    element?.classList.add("fadeIn");
  }

  hideSlime(){
    var element = document.getElementById("slimeyId");
    element?.classList.add("fadeOut");
    element?.classList.remove("fadeIn");
  }

  spawn() {
    this.slimeIsPresent = true;
    // TODO Animation angular avec forwards
    this.showSlime();
  }

  death(){
    this.slimeIsPresent = false;
    // TODO Animation angular avec forwards
    this.hideSlime();
    // TODO 2e animation angular en même temps
    this.ng_death ++;
  }

  attack(){
    // TODO Jouer une animation et augmenter l'intensité du mouvement avec scale
    // TODO Jouer une autre animation avant
    this.ng_attack ++;
  }

  hit(){
    // TODO Utilisé Animista pour faire une animation différente avec css (wobble)
        this.css_hit = true;
    setTimeout(() => this.css_hit = false, 1 * 1000);
  }

  async bsf(){
    this.ng_b ++;
    await this.waitFor(1)
    this.ng_s ++;
    await this.waitFor(1)
    this.ng_f++;
    await this.waitFor(1)
  }

playShake() {
  if(!this.isPlaying)
    return
  this.css_rotateCenter = true;
  setTimeout(() => {
    // On appel playBounce, qui va appeler playShake, qui va appeler playBounce, qui va appeler playShake, qui va appeler....
      this.css_rotateCenter = false;

    this.playBounce();
  },1000);
}

playBounce() {
    if(!this.isPlaying)
    return
  this.css_rotateHorTop = true;
  setTimeout(() => {
      this.css_rotateHorTop = false;

    this.playShake();
  },1000);
}

  

  infinite(){
    if(this.isPlaying)
    {
      this.isPlaying = false;
      this.css_rotateHorTop = false;
      this.css_rotateCenter = false;
      return
    }
    this.isPlaying =true;
    this.playShake();
  }

  async waitFor(delayInSeconds:number) {
  await lastValueFrom(timer(delayInSeconds * 1000));
}
}
