package org.joht.livecoding.eventdriven.address;

import java.util.Objects;

public class Address {

	private final String id;
	private final String name;
	private final String street;
	private final String country;

	public Address(String id, String name, String street, String country) {
		this.id = id;
		this.name = name;
		this.street = street;
		this.country = country;
	}

	public String getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getStreet() {
		return street;
	}

	public Address movedToStreet(String newStreet) {
		return new Address(id, name, newStreet, country);
	}
	
	public String getCountry() {
		return country;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (getClass() != obj.getClass()) {
			return false;
		}
		Address other = (Address) obj;
		return Objects.equals(id, other.id) //
				&& Objects.equals(country, other.country) //
				&& Objects.equals(name, other.name) //
				&& Objects.equals(street, other.street);
	}

	@Override
	public String toString() {
		return "Address [id=" + id + ", name=" + name + ", street=" + street + ", country=" + country + "]";
	}
}