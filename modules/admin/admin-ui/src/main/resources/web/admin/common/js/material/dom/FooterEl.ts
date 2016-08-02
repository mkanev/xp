module api.material.dom {

    import Element = api.dom.Element;
    import NewElementBuilder = api.dom.NewElementBuilder;

    export class FooterEl extends Element {
        constructor(className?: string) {
            super(new NewElementBuilder().setTagName("footer").setClassName(className));
        }
    }
}
