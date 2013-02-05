package com.enonic.wem.core.content.mixin;

import javax.jcr.Session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.enonic.wem.api.command.content.mixin.GetMixins;
import com.enonic.wem.api.content.mixin.Mixins;
import com.enonic.wem.api.content.mixin.QualifiedMixinNames;
import com.enonic.wem.core.command.CommandContext;
import com.enonic.wem.core.command.CommandHandler;
import com.enonic.wem.core.content.mixin.dao.MixinDao;

@Component
public final class GetMixinsHandler
    extends CommandHandler<GetMixins>
{
    private MixinDao mixinDao;

    public GetMixinsHandler()
    {
        super( GetMixins.class );
    }

    @Override
    public void handle( final CommandContext context, final GetMixins command )
        throws Exception
    {
        final Session session = context.getJcrSession();

        final Mixins mixins;
        if ( command.isGetAll() )
        {
            mixins = getAllMixins( session );
        }
        else
        {
            final QualifiedMixinNames qualifiedNames = command.getQualifiedMixinNames();
            mixins = getMixins( qualifiedNames, session );
        }

        command.setResult( mixins );
    }

    private Mixins getAllMixins( final Session session )
    {
        return mixinDao.selectAll( session );
    }

    private Mixins getMixins( final QualifiedMixinNames qualifiedMixinNames, final Session session )
    {
        return mixinDao.select( qualifiedMixinNames, session );
    }

    @Autowired
    public void setMixinDao( final MixinDao mixinDao )
    {
        this.mixinDao = mixinDao;
    }
}
