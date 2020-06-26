import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DERELICT, SHIP_NAMES } from 'src/app/services/randomTables.constants';
import { RandomNumberService } from 'src/app/services/randomNumber.service';

@Component({
  selector: 'app-derelict-generator',
  templateUrl: './derelict-generator.component.html',
  styleUrls: ['./derelict-generator.component.scss']
})
export class DerelictGeneratorComponent implements OnChanges {
  @Input() genDerelict = false;
  derelictObject: any;
  derelictName = '';
  objectKeys = Object.keys;

  constructor(private random: RandomNumberService) { }

  ngOnChanges() {
    this.rollRandomDerelict();
  }

  rollRandomDerelict() {
    let salvage = '';
    this.derelictName = '';
    this.derelictObject = this.objectKeys(DERELICT).map((key) => {
      const rand = this.random.getRandomNumber(0, 99);
      const derelict = DERELICT[key];
      let tableResults = derelict.table[rand];
      const dieIndex = tableResults.indexOf('d1');
      let units = 0;

      if (dieIndex > -1) {
        const iterations = tableResults[dieIndex - 1];
        const dieSize = tableResults.slice(dieIndex + 1, tableResults.indexOf(' '));

        for (let i = 0; i < iterations; i++) {
          units += this.random.getRandomNumber(1, dieSize);
        }
        tableResults = tableResults.replace(`${iterations}d${dieSize}`, units);
      }

      if (derelict.title === 'salvage_1' || derelict.title === 'salvage_2') {
        salvage = salvage + tableResults;
        if (derelict.title === 'salvage_1') {
          salvage = salvage + ', ';
        }
      }

      return {
        title: derelict.title === 'salvage_2' ? 'salvage' : derelict.title,
        table: derelict.title === 'salvage_2' ? salvage :  tableResults
      };
    });
    SHIP_NAMES.forEach(name => {
      this.derelictName = `${this.derelictName} ${name[this.random.getRandomNumber(0, 9)]}`.trim();
    });
  }
}
