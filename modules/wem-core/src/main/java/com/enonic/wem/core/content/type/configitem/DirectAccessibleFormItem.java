package com.enonic.wem.core.content.type.configitem;

import org.elasticsearch.common.base.Preconditions;

public abstract class DirectAccessibleFormItem
    extends FormItem
{
    private FormItemPath path;

    protected DirectAccessibleFormItem( final FormItemType type )
    {
        super( type );
    }

    void setPath( final FormItemPath path )
    {
        Preconditions.checkNotNull( path, "Given path is null" );
        Preconditions.checkArgument( getName().equals( path.getLastElement() ),
                                     "Last element of path must be equal to name [%s]: " + path.getLastElement(), getName() );
        this.path = path;
    }

    void setParentPath( final FormItemPath parentPath )
    {
        Preconditions.checkNotNull( parentPath, "parentPath cannot be null" );

        if ( this.path == null || this.path.elementCount() == 0 )
        {
            throw new IllegalStateException( "Cannot set parent path unless there is already an existing path" );
        }

        this.path = new FormItemPath( parentPath, this.path.getLastElement() );
    }

    public final FormItemPath getPath()
    {
        return path;
    }

    public DirectAccessibleFormItem copy()
    {
        final DirectAccessibleFormItem formItem = (DirectAccessibleFormItem) super.copy();
        formItem.path = path;
        return formItem;
    }

    @Override
    public String toString()
    {
        FormItemPath formItemPath = getPath();
        if ( formItemPath != null )
        {
            return formItemPath.toString();
        }
        else
        {
            return getName() + "?";
        }
    }
}
