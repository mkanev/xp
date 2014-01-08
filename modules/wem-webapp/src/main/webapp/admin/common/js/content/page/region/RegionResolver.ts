module api.content.page.region {

    export class RegionResolver extends api.data.PropertyVisitor {

        private data: api.data.RootDataSet;

        private regionProperties: api.data.Property[] = [];

        constructor(data: api.data.RootDataSet) {
            super();
            this.data = data;
            this.restrictType(api.data.ValueTypes.DATA);
        }

        public visit(property: api.data.Property) {
            this.regionProperties.push(property);
        }

        resolve(): PageRegions {

            this.traverse(this.data.getDataArray());

            var regions = new PageRegionsBuilder();

            this.regionProperties.forEach((property: api.data.Property) => {

                var value: api.data.RootDataSet = property.getValue().asRootDataSet();
                var region: Region = new RegionBuilder().fromRootDataSet(value).build();
                regions.addRegion(region);
            });

            return regions.build();
        }
    }


}