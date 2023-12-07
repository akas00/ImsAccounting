import {ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild} from "@angular/core";
import {isNullOrUndefined} from "util";
import { ContextMenuView, MenuItem } from "./context-menu-data";

@Component({
    selector: "app-contextmenu",
    templateUrl: "./context-menu.component.html",
    styleUrls: ["./context-menu.component.scss"]
})
export class ContextmenuComponent implements OnInit {

    private static IDLE_TIMEOUT_MS = 20000;
    private static MOUSE_OUT_TIMEOUT_MS = 20000;
    @Input() data: ContextMenuView;
    @ViewChild("modalcontainer") container: ElementRef;
    containerPosY = 0;
    containerPosX = 0;
    isArrowUpward = true;
    private autoHideTimer: any;

    constructor(@Inject(ChangeDetectorRef) private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.changeDetectorRef.detectChanges();
        this.prepareContextMenu();
    }

    public hideContextMenuWithTimer(miliseconds) {
        if (isNullOrUndefined(miliseconds)) {
            miliseconds = ContextmenuComponent.MOUSE_OUT_TIMEOUT_MS;
        }
        this.autoHideTimer = setTimeout(() => {
            this.data.show = false;
        }, miliseconds);
    }

    public clearContextMenuHideTimer() {
        clearTimeout(this.autoHideTimer);
    }

    isValueNullOrUndefined(value) {
        if (isNullOrUndefined(value)) {
            return true;
        }
        return false;
    }

    callSubscriber(item: MenuItem) {
        item.subject.next(item);
    }

    private prepareContextMenu() {
        try {
            this.validateData();
            this.buildDisplayPositions();
        } catch (e) {
            this.hideContextMenuWithTimer(0);
            console.error("unable to prepareContextMenu the context menu due to following exception/error: " + e);
        } finally {
            if (this.data.show) {
                this.hideContextMenuWithTimer(ContextmenuComponent.IDLE_TIMEOUT_MS);
            }

        }
    }

    private buildDisplayPositions() {
        const containerElement: any = this.container.nativeElement;
        let height = 0;
        if (!isNullOrUndefined(containerElement)) {
            height = containerElement.offsetHeight;
        }

        if (height > 0) {
            this.buildTopPosition(height);
            this.buildLeftPosition();
        }
    }

    private validateData() {
        if (isNullOrUndefined(this.data)) {
            throw new TypeError("context menu info can not be null or undefined");
        }

        if (isNullOrUndefined(this.data.mouseEvent)) {
            throw new TypeError("context menu should be associated with mouseEvent e.g. mouse left click");
        }

        if (isNullOrUndefined(this.data.menuItems)) {
            throw new TypeError("action item is missing");
        }
    }

    private buildLeftPosition() {
        const clickedPosX = this.data.mouseEvent.clientX;
        this.containerPosX = clickedPosX;
    }

    private buildTopPosition(contextMenuHeight: number) {
        const clickedElementHeight = this.data.mouseEvent.currentTarget.offsetHeight;
        const pageHeight = window.innerHeight;
        const clickedPosY = this.data.mouseEvent.clientY;
        const sum = contextMenuHeight + clickedPosY + clickedElementHeight;
        let top =-10;
        if (sum < pageHeight) {
            top = clickedPosY + clickedElementHeight;
        } else {
            top = clickedPosY - (contextMenuHeight + clickedElementHeight);
            this.isArrowUpward = false;
        }
        if (top < 0) {
            top = 0;
        }
        this.containerPosY = top;
    }
}
