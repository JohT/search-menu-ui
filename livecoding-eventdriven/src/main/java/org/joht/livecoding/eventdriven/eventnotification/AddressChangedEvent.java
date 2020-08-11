package org.joht.livecoding.eventdriven.eventnotification;

import java.util.Objects;

public class AddressChangedEvent {

	private final String id;

	public AddressChangedEvent(String id) {
		this.id = id;
	}
	
	public String getId() {
		return id;
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
		AddressChangedEvent other = (AddressChangedEvent) obj;
		return Objects.equals(id, other.id);
	}

	@Override
	public String toString() {
		return "AddressChangedEvent [id=" + id + "]";
	}
}