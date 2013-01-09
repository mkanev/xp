package com.enonic.wem.api.command;

import com.enonic.wem.api.command.account.AccountCommands;
import com.enonic.wem.api.command.content.ContentCommands;
import com.enonic.wem.api.command.content.relation.RelationshipTypeCommands;
import com.enonic.wem.api.command.content.type.ContentTypeCommands;
import com.enonic.wem.api.command.content.type.SubTypeCommands;
import com.enonic.wem.api.command.userstore.UserStoreCommands;

public abstract class Commands
{
    public static AccountCommands account()
    {
        return new AccountCommands();
    }

    public static UserStoreCommands userStore()
    {
        return new UserStoreCommands();
    }

    public static ContentCommands content()
    {
        return new ContentCommands();
    }

    public static ContentTypeCommands contentType()
    {
        return new ContentTypeCommands();
    }

    public static SubTypeCommands subType()
    {
        return new SubTypeCommands();
    }

    public static RelationshipTypeCommands relationshipType()
    {
        return new RelationshipTypeCommands();
    }
}
