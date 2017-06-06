import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html'
})

export class ModalComponent {
    
    @Input() succesName = "Ok";

    @Output() onSucces = new EventEmitter<void>();
    @Output() onCancel = new EventEmitter<void>();

    private show = false;

    public open() {
        this.show = true;
    }

    public close() {
        this.show = false;
    }

    public cancel() {
        this.close();
        this.onCancel.emit();
    }

    public succes() {
        this.close();
        this.onSucces.emit();
    }
}