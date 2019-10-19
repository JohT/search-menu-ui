package org.joht.livecoding.becomingfunctional.pure.model;

import java.util.Objects;

public class Kundennummer implements Comparable<Kundennummer> {

	private final long value;

	public static final Kundennummer of(long value) {
		return new Kundennummer(value);
	}

	public static final Kundennummer ofNumber(Number number) {
		return new Kundennummer(number.longValue());
	}

	protected Kundennummer(long value) {
		this.value = value;
	}

	public long getValue() {
		return value;
	}

	public Long asLong() {
		return Long.valueOf(value);
	}

	@Override
	public int compareTo(Kundennummer o) {
		return Long.compare(getValue(), o.getValue());
	}

	@Override
	public boolean equals(final Object other) {
		if ((other == null) || (!getClass().equals(other.getClass()))) {
			return false;
		}
		return Objects.equals(value, ((Kundennummer) other).value);
	}

	@Override
	public int hashCode() {
		return Objects.hash(value);
	}

	@Override
	public String toString() {
		return "Kundennummer [value=" + value + "]";
	}
}
