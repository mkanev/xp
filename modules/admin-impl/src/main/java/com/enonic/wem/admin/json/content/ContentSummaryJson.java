package com.enonic.wem.admin.json.content;

import java.time.Instant;

import com.enonic.wem.admin.json.ChangeTraceableJson;
import com.enonic.wem.admin.json.ItemJson;
import com.enonic.wem.admin.json.thumb.ThumbnailJson;
import com.enonic.wem.admin.rest.resource.content.ContentIconUrlResolver;
import com.enonic.wem.admin.rest.resource.content.json.ChildOrderJson;
import com.enonic.wem.api.content.Content;

@SuppressWarnings("UnusedDeclaration")
public class ContentSummaryJson
    extends ContentIdJson
    implements ChangeTraceableJson, ItemJson
{
    private final Content content;

    private final String iconUrl;

    private final ThumbnailJson thumbnailJson;

    private final boolean deletable;

    private final boolean isSite;

    private final boolean isPage;

    private final ChildOrderJson childOrderJson;

    public ContentSummaryJson( final Content content, final ContentIconUrlResolver iconUrlResolver )
    {
        super( content.getId() );
        this.content = content;
        this.iconUrl = iconUrlResolver.resolve( content );
        this.thumbnailJson = content.hasThumbnail() ? new ThumbnailJson( content.getThumbnail() ) : null;
        this.isSite = content.isSite();
        this.isPage = content.hasPage();
        this.deletable = !content.hasChildren();
        this.childOrderJson = content.getChildOrder() != null ? new ChildOrderJson( content.getChildOrder() ) : null;
    }

    public String getIconUrl()
    {
        return iconUrl;
    }

    public ThumbnailJson getThumbnail()
    {
        return this.thumbnailJson;
    }

    public String getPath()
    {
        return content.getPath().toString();
    }

    public String getName()
    {
        return content.getName().toString();
    }

    public String getType()
    {
        return content.getType() != null ? content.getType().toString() : null;
    }

    public String getDisplayName()
    {
        return content.getDisplayName();
    }

    public String getOwner()
    {
        return content.getOwner() != null ? content.getOwner().toString() : null;
    }

    public String getLanguage()
    {
        return content.getLanguage() != null ? content.getLanguage().toLanguageTag() : null;
    }

    public boolean getIsRoot()
    {
        return content.isRoot();
    }

    public Instant getCreatedTime()
    {
        return content.getCreatedTime();
    }

    public String getCreator()
    {
        return content.getCreator() != null ? content.getCreator().toString() : null;
    }

    public Instant getModifiedTime()
    {
        return content.getModifiedTime();
    }

    public String getModifier()
    {
        return content.getModifier() != null ? content.getModifier().toString() : null;
    }

    public boolean getHasChildren()
    {
        return content.hasChildren();
    }

    public boolean getIsDraft()
    {
        return content.isDraft();
    }

    public ChildOrderJson getChildOrder()
    {
        return this.childOrderJson;
    }

    public boolean getIsPage()
    {
        return isPage;
    }

    @Override
    public boolean getEditable()
    {
        return true;
    }

    @Override
    public boolean getDeletable()
    {
        return deletable;
    }

}