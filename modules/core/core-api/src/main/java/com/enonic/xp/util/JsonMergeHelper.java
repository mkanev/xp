package com.enonic.xp.util;

import java.util.Iterator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class JsonMergeHelper
{
    public static JsonNode merge( JsonNode mainNode, JsonNode updateNode )
    {
        Iterator<String> fieldNames = updateNode.fieldNames();
        while ( fieldNames.hasNext() )
        {

            String fieldName = fieldNames.next();
            JsonNode jsonNode = mainNode.get( fieldName );

            final boolean fieldExistsAndIsEmbeddedObject = jsonNode != null && jsonNode.isObject();
            if ( fieldExistsAndIsEmbeddedObject )
            {
                merge( jsonNode, updateNode.get( fieldName ) );
            }
            else
            {
                if ( mainNode instanceof ObjectNode )
                {
                    JsonNode value = updateNode.get( fieldName );
                    ( (ObjectNode) mainNode ).replace( fieldName, value );
                }
            }

        }

        return mainNode;
    }
}
