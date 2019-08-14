import { Component, Input } from '@angular/core';
import { Link } from '../../../d3';

@Component({
  selector: '[linkVisual]',
  templateUrl: './link-visual.html',
  styleUrls: ['./link-visual.component.css']
})

export class LinkVisualComponent  {
  // tslint:disable-next-line: no-input-rename
  @Input('linkVisual') link: Link;
}
