package com.enonic.xp.repo.impl.storage;

public class GetAllRequest
    extends AbstractGetRequest
{
    public GetAllRequest( final Builder builder )
    {
        super( builder );
    }

    public static Builder create()
    {
        return new Builder();
    }

    public static class Builder
        extends AbstractGetRequest.Builder<Builder>
    {
        public Builder()
        {
            super();
        }

        public GetAllRequest build()
        {
            return new GetAllRequest( this );
        }
    }
}
