module api.material.dom {

    import Element = api.dom.Element;
    import NewElementBuilder = api.dom.NewElementBuilder;

    export class HeaderEl extends Element {
        constructor(className?: string) {
            super(new NewElementBuilder().setTagName("header").setClassName(className));
        }
    }
}
