package com.enonic.xp.xml.schema;

import java.io.IOException;
import java.util.List;

import javax.xml.transform.dom.DOMResult;
import javax.xml.transform.dom.DOMSource;

import org.xml.sax.SAXException;

import com.google.common.collect.Lists;

public final class SchemaValidator
{
    private final List<SchemaHandler> list;

    public SchemaValidator()
    {
        this.list = Lists.newArrayList();
        register( "urn:enonic:xp:export:1.0", "/META-INF/xsd/export.xsd" );
        register( "urn:enonic:xp:model:1.0", "/META-INF/xsd/model.xsd" );
    }

    private void register( final String ns, final String location )
    {
        register( new SchemaHandler( ns, location ) );
    }

    private void register( final SchemaHandler validator )
    {
        this.list.add( validator );
    }

    public DOMResult validate( final DOMSource source )
        throws IOException, SAXException
    {
        for ( final SchemaHandler validator : this.list )
        {
            if ( validator.canValidate( source ) )
            {
                return validator.validate( source );
            }
        }

        return new DOMResult( source.getNode() );
    }
}