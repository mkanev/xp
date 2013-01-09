package com.enonic.wem.api.command.content.relation.editor;

import com.enonic.wem.api.content.relation.RelationshipType;

public abstract class RelationshipTypeEditors
{
    public static RelationshipTypeEditor composite( final RelationshipTypeEditor... editors )
    {
        return new CompositeRelationshipTypeEditor( editors );
    }

    public static RelationshipTypeEditor setRelationshipType( final RelationshipType relationshipType )
    {
        return new SetRelationshipTypeEditor( relationshipType );
    }
}
