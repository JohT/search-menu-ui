package org.joht.livecoding.becomingfunctional.pure;

import java.util.Collection;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.joht.livecoding.becomingfunctional.pure.model.KontoEntity;
import org.junit.Ignore;

/**
 * Object-Mother zum Erzeugen von Test-Objekte vom Typ {@link KontoEntity}.
 * 
 * @author johannestroppacher
 */
@Ignore
enum KontoEntityTestdaten {

	AKTIVES_KONTO_1 {
		@Override
		public KontoEntity build() {
			KontoEntity konto = new KontoEntity(1);
			konto.setExtern(false);
			return konto;
		}
	},
	AKTIVES_EXTERNES_KONTO_2 {
		@Override
		public KontoEntity build() {
			KontoEntity konto = new KontoEntity(2);
			konto.setExtern(true);
			return konto;
		}
	},
	GELOESCHTES_KONTO_3 {
		@Override
		public KontoEntity build() {
			KontoEntity konto = new KontoEntity(3);
			konto.setExtern(false);
			konto.loeschen();
			return konto;
		}
	},
	GELOESCHTES_EXTERNES_KONTO_4 {
		@Override
		public KontoEntity build() {
			KontoEntity konto = new KontoEntity(4);
			konto.setExtern(true);
			konto.loeschen();
			return konto;
		}
	},

	;
	public abstract KontoEntity build();

	public static final Collection<KontoEntity> alle() {
		return of(values());
	}

	public static final Collection<KontoEntity> of(KontoEntityTestdaten... testdaten) {
		return Stream.of(testdaten).map(KontoEntityTestdaten::build).collect(Collectors.toList());
	}
}