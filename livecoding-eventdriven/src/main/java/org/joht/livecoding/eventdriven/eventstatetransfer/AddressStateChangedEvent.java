package org.joht.livecoding.eventdriven.eventstatetransfer;

import java.util.Objects;

import org.joht.livecoding.eventdriven.address.Address;

public class AddressStateChangedEvent {

	private final Address oldAdress; 
	private final Address newAdress;
	
	public AddressStateChangedEvent(Address oldAdress, Address newAdress) {
		this.oldAdress = oldAdress;
		this.newAdress = newAdress;
	}

	public Address getOldAdress() {
		return oldAdress;
	}
	
	public Address getNewAdress() {
		return newAdress;
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(newAdress, oldAdress);
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
		AddressStateChangedEvent other = (AddressStateChangedEvent) obj;
		return Objects.equals(newAdress, other.newAdress) && Objects.equals(oldAdress, other.oldAdress);
	}

	@Override
	public String toString() {
		return "AddressStateChangedEvent [oldAdress=" + oldAdress + ", newAdress=" + newAdress + "]";
	} 
}