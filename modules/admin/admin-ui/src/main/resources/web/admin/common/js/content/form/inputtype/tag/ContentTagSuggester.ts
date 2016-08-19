import {Content} from "../../../Content";
import {ContentJson} from "../../../json/ContentJson";
import {ContentQuery} from "../../../query/ContentQuery";
import {ContentQueryRequest} from "../../../resource/ContentQueryRequest";
import {QueryExpr} from "../../../../query/expr/QueryExpr";
import {FieldExpr} from "../../../../query/expr/FieldExpr";
import {CompareOperator} from "../../../../query/expr/CompareOperator";
import {FunctionExpr} from "../../../../query/expr/FunctionExpr";
import {DynamicConstraintExpr} from "../../../../query/expr/DynamicConstraintExpr";
import {ValueExpr} from "../../../../query/expr/ValueExpr";
import {PropertyPath} from "../../../../data/PropertyPath";
import {Property} from "../../../../data/Property";
import {Value} from "../../../../data/Value";
import {ValueType} from "../../../../data/ValueType";
import {ValueTypes} from "../../../../data/ValueTypes";
import {TagSuggester} from "../../../../ui/tags/TagSuggester";
import {Expression} from "../../../../query/expr/Expression";
import {FulltextSearchExpressionBuilder} from "../../../../query/FulltextSearchExpression";
import {QueryField} from "../../../../query/QueryField";
import {Expand} from "../../../../rest/Expand";
import {ContentQueryResult} from "../../../resource/result/ContentQueryResult";

export class ContentTagSuggesterBuilder {

        dataPath: PropertyPath;

        setDataPath(value: PropertyPath): ContentTagSuggesterBuilder {
            this.dataPath = value;
            return this;
        }

        build(): ContentTagSuggester {
            return new ContentTagSuggester(this);
        }
    }

    export class ContentTagSuggester implements TagSuggester {

        private propertyPath: PropertyPath;

        constructor(builder: ContentTagSuggesterBuilder) {
            this.propertyPath = builder.dataPath;
        }

        suggest(value: string): wemQ.Promise<string[]> {

            var fieldName = "data" + this.propertyPath.getParentPath().toString() + this.propertyPath.getLastElement().getName();

            var fulltextExpression: Expression = new FulltextSearchExpressionBuilder().
                setSearchString(value).
                addField(new QueryField(fieldName)).
                build();

            var queryExpr: QueryExpr = new QueryExpr(fulltextExpression);

            var query = new ContentQuery();
            query.setSize(10);
            query.setQueryExpr(queryExpr);

            var queryRequest = new ContentQueryRequest(query);
            queryRequest.setExpand(Expand.FULL);

            return queryRequest.sendAndParse().then(
                (contentQueryResult: ContentQueryResult<Content,ContentJson>) => {

                    var suggestedTags: string[] = [];
                    contentQueryResult.getContents().forEach((content: Content) => {
                        var propertySet = this.propertyPath.getParentPath().isRoot() ?
                                          content.getContentData().getRoot() :
                                          content.getContentData().getPropertySet(this.propertyPath);
                        propertySet.forEachProperty(this.propertyPath.getLastElement().getName(), (property: Property) => {
                            if (property.hasNonNullValue()) {
                                var suggestedTag = property.getString();
                                if (suggestedTag.search(new RegExp(value, "i")) == 0 && suggestedTags.indexOf(suggestedTag) < 0) {
                                    suggestedTags.push(suggestedTag);
                                }
                            }
                        });
                    });
                    return suggestedTags;
                });
        }
    }
