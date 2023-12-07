import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnChanges
} from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "dynamic-filter-option-popup",
  templateUrl: "./dynamic-filter-option-popup.component.html",
  styleUrls: ["../../../pages/Style.css", "../pStyle.css"]
})
export class DynamicFilterOptionComponent implements OnChanges {
  @Output() onPopUpClose = new EventEmitter();
  @Output() onApplyClick = new EventEmitter();
  @Input() dynamicFilterSettings: DynamicFilterSetting;
  public key = new FormControl('')
  isActive: boolean = false;
  currentFilterOption: DynamicFilterOption = new DynamicFilterOption();
  selectedFilterOptions: SelectedFilterOption[] = [];

  constructor() {

  }

  show() {
    setTimeout(() => {
      this.isActive = true;
    }, 100);
  }

  ngOnChanges(changes: any) {
    this.dynamicFilterSettings = changes.dynamicFilterSettings.currentValue
    this.resetCurrentFilterOption()
    this.addStaticOptionsToList()
  }



  addStaticOptionsToList() {
    this.selectedFilterOptions = [];
    this.dynamicFilterSettings.filterOptions.forEach(
      x => {
        if (x.isSelected) {
          let i = new SelectedFilterOption();

          i.filterOperatorKey = x.filterOperatorDefaultValue;
          i.filterOptionKey = x.key;
          i.filterValue = x.filterType.value;

          this.selectedFilterOptions.push(i);
        }
      }
    )
  }

  onFilterOptionChanged(event: any) {
    this.dynamicFilterSettings.filterOptions.forEach(x => {
      if (x.key == event) {
        this.setCurrentFilterOption(x)
      }
    });

  }

  setCurrentFilterOption(filter: any) {
    this.currentFilterOption = new DynamicFilterOption();
    this.currentFilterOption = filter
    this.key.patchValue(this.currentFilterOption.key)
  }


  addFilterOption() {
    let index = this.dynamicFilterSettings.filterOptions.indexOf(this.currentFilterOption);
    if (this.currentFilterOption.key == "" || this.currentFilterOption.key == undefined || this.currentFilterOption.key == null) return;
    if (this.currentFilterOption.filterOperatorDefaultValue == "" || this.currentFilterOption.filterOperatorDefaultValue == undefined || this.currentFilterOption.filterOperatorDefaultValue == null) return;
    if (this.currentFilterOption.filterType.value == "" || this.currentFilterOption.filterType.value == undefined || this.currentFilterOption.filterType.value == null) return;
    if (index > -1) this.dynamicFilterSettings.filterOptions[index].isSelected = true;
    this.resetCurrentFilterOption();

  }

  deletFilterOption(index) {
    if (index > -1) {
      this.dynamicFilterSettings.filterOptions[index].isSelected = false;
    }
    this.resetCurrentFilterOption()
  }


  resetCurrentFilterOption() {
    this.currentFilterOption = this.dynamicFilterSettings.filterOptions.filter(x => !x.isDefaultFixed && !x.isSelected).length ? this.dynamicFilterSettings.filterOptions.find(x => !x.isDefaultFixed && !x.isSelected) : new DynamicFilterOption();
    if (!this.dynamicFilterSettings.filterOptions.filter(x => !x.isDefaultFixed && !x.isSelected).length) {
      this.currentFilterOption.filterType.type = 'text'
    }
    this.key.patchValue(this.currentFilterOption.key)

  }

  hide() {
    this.isActive = false;
  }

  applyClicked($event) {
    this.addStaticOptionsToList();
    this.onApplyClick.emit(this.selectedFilterOptions);
    this.hide();
  }

  @HostListener("document : keydown", ["$event"])
  @debounce(20)
  updown($event: KeyboardEvent) {
    if (!this.isActive) return true;
    if ($event.code == "Escape") {
      $event.preventDefault();
      this.hide();
      this.popupClose();
    }
  }

  popupClose() {
    this.onPopUpClose.emit();
    this.hide();
  }

}

export class DynamicFilterSetting {
  title: string = "";
  filterOptions: DynamicFilterOption[] = [] // all list of filter option with values
  //filterOperatorOptions : GenericTitleValue[] = [] // comparable operators
}

export class DynamicFilterOption {
  key: string = ""; // key representing database column
  title: string = ""; // title represents dropdown option title
  isDefaultFixed: boolean = false;
  isSelected: boolean = false; // isSelected true is not present in the option and it is always in selected list
  filterType: FilterType = <FilterType>{};
  filterOperatorDefaultValue: string = "";
  filterOperatorOptions: GenericTitleValue[] = []; //only valid if isSelected is true
}

export class FilterType {
  type: string = "";  // only support | dropdown | text 
  value: string = ""; // valid if type = text
  options: GenericTitleValue[] = []; // list if type is dropdown | checbox
}

export class GenericTitleValue {
  title: string = ""; // title
  value: string = ""; //value
  selected: boolean = false;
}

export class SelectedFilterOption {
  filterOptionKey: string = ""; // title
  filterOperatorKey: string = ""; //value
  filterValue: string = "";
}

export function debounce(delay: number): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    const original = descriptor.value;
    const key = `__timeout__${propertyKey}`;

    descriptor.value = function (...args) {
      clearTimeout(this[key]);
      this[key] = setTimeout(() => original.apply(this, args), delay);
    };

    return descriptor;
  };
}