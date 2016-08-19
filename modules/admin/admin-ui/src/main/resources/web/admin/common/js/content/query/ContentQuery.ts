import {Equitable} from "../../Equitable";
import {QueryExpr} from "../../query/expr/QueryExpr";
import {ContentTypeName} from "../../schema/content/ContentTypeName";
import {ContentId} from "../ContentId";
import {AggregationQuery} from "../../query/aggregation/AggregationQuery";
import {Filter} from "../../query/filter/Filter";
import {ObjectHelper} from "../../ObjectHelper";

export class ContentQuery implements Equitable {

        static POSTLOAD_SIZE = 10;

        static DEFAULT_SIZE = 100;

        private queryExpr: QueryExpr;

        private contentTypeNames: ContentTypeName[] = [];

        private mustBeReferencedById: ContentId;

        private aggregationQueries: AggregationQuery[] = [];

        private queryFilters: Filter[] = [];

        private from: number = 0;

        private size: number = ContentQuery.DEFAULT_SIZE;

        setQueryExpr(queryExpr: QueryExpr): ContentQuery {
            this.queryExpr = queryExpr;
            return this;
        }

        getQueryExpr(): QueryExpr {
            return this.queryExpr;
        }

        setContentTypeNames(contentTypeNames: ContentTypeName[]): ContentQuery {
            this.contentTypeNames = contentTypeNames;
            return this;
        }

        getContentTypes(): ContentTypeName[] {
            return this.contentTypeNames;
        }

        setMustBeReferencedById(id: ContentId): ContentQuery {
            this.mustBeReferencedById = id;
            return this;
        }

        getMustBeReferencedById(): ContentId {
            return this.mustBeReferencedById;
        }

        setFrom(from: number): ContentQuery {
            this.from = from;
            return this;
        }

        getFrom(): number {
            return this.from;
        }

        setSize(size: number): ContentQuery {
            this.size = size;
            return this;
        }

        getSize(): number {
            return this.size;
        }

        addAggregationQuery(aggregationQuery: AggregationQuery): ContentQuery {
            this.aggregationQueries.push(aggregationQuery);
            return this;
        }

        setAggregationQueries(aggregationQueries: AggregationQuery[]): ContentQuery {
            this.aggregationQueries = aggregationQueries;
            return this;
        }

        getAggregationQueries(): AggregationQuery[] {
            return this.aggregationQueries;
        }

        addQueryFilter(queryFilter: Filter): ContentQuery {
            this.queryFilters.push(queryFilter);
            return this;
        }

        setQueryFilters(queryFilters: Filter[]): ContentQuery {
            this.queryFilters = queryFilters;
            return this;
        }

        getQueryFilters(): Filter[] {
            return this.queryFilters;
        }

        equals(o: Equitable): boolean {
            if (!ObjectHelper.iFrameSafeInstanceOf(o, ContentQuery)) {
                return false;
            }

            var other = <ContentQuery>o;

            if (!ObjectHelper.numberEquals(this.from, other.from)) {
                return false;
            }

            if (!ObjectHelper.numberEquals(this.size, other.size)) {
                return false;
            }

            if (!ObjectHelper.arrayEquals(this.contentTypeNames, other.contentTypeNames)) {
                return false;
            }

            if (!ObjectHelper.anyArrayEquals(this.aggregationQueries, other.aggregationQueries)) {
                return false;
            }

            if (!ObjectHelper.anyArrayEquals(this.queryFilters, other.queryFilters)) {
                return false;
            }

            if ((!this.queryExpr && other.queryExpr) ||
                (this.queryExpr && !other.queryExpr) ||
                (this.queryExpr && other.queryExpr &&
                 !ObjectHelper.stringEquals(this.queryExpr.toString(), other.queryExpr.toString()))) {
                return false;
            }

            return true;
        }
    }
