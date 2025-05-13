/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pong.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/10 15:16:55 by mtbanban          #+#    #+#             */
/*   Updated: 2025/05/13 19:34:20 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from './component.js';
interface Position { x: number; y: number; }

class Bar {
  position: Position = { x: 0, y: 0 };
  velocity: Position = { x: 0, y: 0 };
  speed = 800;
  height: number;

  constructor(public element: HTMLElement) {
    this.height = element.offsetHeight;
  }

  update(dt: number, H: number) {
    const margin = H * 0.1;              // 10% top/bottom
    const maxY   = H - this.height - margin;
    this.position.y += this.velocity.y * dt;
    this.position.y = Math.max(margin, Math.min(maxY, this.position.y));
    this.element.style.transform = `translateY(${this.position.y}px)`;
  }

  applyPosition() {
    this.element.style.transform = `translateY(${this.position.y}px)`;
  }
}

function handleKeyPress(bar: Bar, up: string, down: string, e: KeyboardEvent) {
  const k = e.key.toLowerCase();
  if (k === up && bar.velocity.y === 0)    bar.velocity.y = -bar.speed;
  if (k === down && bar.velocity.y === 0)  bar.velocity.y =  bar.speed;
}

function handleKeyRelease(bar: Bar, up: string, down: string, e: KeyboardEvent) {
  const k = e.key.toLowerCase();
  if (k === up || k === down) bar.velocity.y = 0;
}

export class pong implements Component {
  private leftBar: Bar;
  private rightBar: Bar;
  private rafId    = 0;
  private lastTime = 0;
  private container: HTMLElement;

  constructor(
    leftBarId: string,
    rightBarId: string,
    containerId: string
  ) {
    const leftEl  = document.getElementById(leftBarId)!;
    const rightEl = document.getElementById(rightBarId)!;
    this.container = document.getElementById(containerId)!;

    this.leftBar  = new Bar(leftEl);
    this.rightBar = new Bar(rightEl);

    // position horizontale 15% / 35%
    const W = this.container.clientWidth;
    leftEl.style.left  = `${W * 0.15}px`;
    rightEl.style.left = `${W * 0.35}px`;

    // centre verticalement au départ
    const H      = this.container.clientHeight;
    const margin = H * 0.1;
    const maxY   = H - this.leftBar.height - margin;
    const center = margin + maxY / 2;
    this.leftBar.position.y  = center;
    this.rightBar.position.y = center;
    this.leftBar.applyPosition();
    this.rightBar.applyPosition();

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup",   this.onKeyUp);
    window.addEventListener("resize",  this.onResize);
  }

  public init(): void {
    this.lastTime = performance.now();
    this.rafId    = requestAnimationFrame(this.gameLoop);
  }

  private onResize = () => {
    const W = this.container.clientWidth;
    this.leftBar.element.style.left  = `${W * 0.15}px`;
    this.rightBar.element.style.left = `${W * 0.35}px`;
  };

  private onKeyDown = (e: KeyboardEvent) => {
    handleKeyPress(this.leftBar,  "z",        "s",         e);
    handleKeyPress(this.rightBar, "arrowup",  "arrowdown", e);
  };

  private onKeyUp = (e: KeyboardEvent) => {
    handleKeyRelease(this.leftBar,  "z",        "s",         e);
    handleKeyRelease(this.rightBar, "arrowup",  "arrowdown", e);
  };

  private gameLoop = (timestamp: number) => {
    const dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    const H = this.container.clientHeight;
    this.leftBar.update(dt, H);
    this.rightBar.update(dt, H);
    this.rafId = requestAnimationFrame(this.gameLoop);
  };

  public destroy(): void {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup",   this.onKeyUp);
    window.removeEventListener("resize",  this.onResize);
    cancelAnimationFrame(this.rafId);
  }
}
