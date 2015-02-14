package com.enonic.wem.api.content;

import java.text.MessageFormat;

import org.apache.commons.lang.StringUtils;

import com.enonic.wem.api.exception.BaseException;
import com.enonic.wem.api.node.NodeAccessException;
import com.enonic.wem.api.node.NodePath;
import com.enonic.wem.api.security.User;
import com.enonic.wem.api.security.acl.Permission;

public final class ContentAccessException
    extends BaseException
{
    private final static String CONTENT_ROOT_NODE_NAME = "content";

    private final User user;

    private final ContentPath contentPath;

    private final Permission permission;

    public ContentAccessException( final NodeAccessException nodeAccessException )
    {
        this( nodeAccessException, nodeAccessException.getUser(), translateNodePathToContentPath( nodeAccessException.getNodePath() ),
              nodeAccessException.getPermission() );
    }

    public ContentAccessException( final User user, final ContentPath contentPath, final Permission permission )
    {
        this( null, user, contentPath, permission );
    }

    private ContentAccessException( final Throwable cause, final User user, final ContentPath contentPath, final Permission permission )
    {
        super( MessageFormat.format( "Access denied to [{0}] for [{1}] by user [{2}] {3}", contentPath, permission,
                                     user == null ? "unknown" : user.getKey(),
                                     user != null && user.getDisplayName() != null ? "''" + user.getDisplayName() + "''" : "" ), cause );
        this.user = user;
        this.contentPath = contentPath;
        this.permission = permission;
    }

    public User getUser()
    {
        return user;
    }

    public ContentPath getContentPath()
    {
        return contentPath;
    }

    public Permission getPermission()
    {
        return permission;
    }

    private static ContentPath translateNodePathToContentPath( final NodePath nodePath )
    {
        final String contentPath = StringUtils.substringAfter( nodePath.asAbsolute().toString(), CONTENT_ROOT_NODE_NAME + "/" );
        return ContentPath.from( contentPath ).asAbsolute();
    }
}