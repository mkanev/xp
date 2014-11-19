package com.enonic.wem.repo.internal.elasticsearch;

import java.util.Arrays;

import org.junit.Test;

import com.enonic.wem.api.index.IndexPaths;
import com.enonic.wem.api.security.PrincipalKey;
import com.enonic.wem.api.security.PrincipalKeys;
import com.enonic.wem.repo.internal.index.result.GetResult;
import com.enonic.wem.repo.internal.index.result.SearchResultEntry;
import com.enonic.wem.repo.internal.index.result.SearchResultFieldValue;

import static org.junit.Assert.*;

public class GetResultCanReadResolverTest
{

    @Test
    public void anonymous_no_access()
        throws Exception
    {
        assertFalse( GetResultCanReadResolver.canRead( PrincipalKeys.empty(), new GetResult( SearchResultEntry.create().
            id( "myId" ).
            addField( IndexPaths.HAS_READ_KEY, SearchResultFieldValue.value( "system:user:rmy" ) ).
            build() ) ) );
    }

    @Test
    public void anonymous_access()
        throws Exception
    {
        assertTrue( GetResultCanReadResolver.canRead( PrincipalKeys.empty(), new GetResult( SearchResultEntry.create().
            id( "myId" ).
            addField( IndexPaths.HAS_READ_KEY, SearchResultFieldValue.value( PrincipalKey.ofAnonymous().toString() ) ).
            build() ) ) );
    }

    @Test
    public void user_access()
        throws Exception
    {
        assertTrue( GetResultCanReadResolver.canRead( PrincipalKeys.from( PrincipalKey.from( "system:user:rmy" ) ),
                                                      new GetResult( SearchResultEntry.create().
                                                          id( "myId" ).
                                                          addField( IndexPaths.HAS_READ_KEY, SearchResultFieldValue.value(
                                                              PrincipalKey.from( "system:user:rmy" ) ) ).
                                                          build() ) ) );
    }

    @Test
    public void group_access()
        throws Exception
    {
        assertTrue( GetResultCanReadResolver.canRead(
            PrincipalKeys.from( PrincipalKey.from( "system:user:rmy" ), PrincipalKey.from( "system:group:my-group" ) ),
            new GetResult( SearchResultEntry.create().
                id( "myId" ).
                addField( IndexPaths.HAS_READ_KEY,
                          SearchResultFieldValue.values( Arrays.asList( "system:user:rmy", "system:group:my-group" ) ) ).
                build() ) ) );
    }

}