import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[mdbBlock]'
})
export class BlockquoteDirective
{

    private blockquote;

    constructor(public el: ElementRef, public render: Renderer2)
    {
        this.blockquote = this.el.nativeElement.parentNode;
    }

    @HostListener('focus', ['$event']) onBlockquoteFocus()
    {
        this.render.addClass(this.blockquote, 'bq-primary');
    }

    @HostListener('blur', ['$event']) onBlockquoteBlur()
    {
        this.render.removeClass(this.blockquote, 'bq-primary');
    }
}
