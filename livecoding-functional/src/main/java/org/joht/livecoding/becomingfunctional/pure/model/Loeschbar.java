package org.joht.livecoding.becomingfunctional.pure.model;

/**
 * Kennzeichnet loeschbare Eintraege.
 * 
 * @author johannestroppacher
 */
public interface Loeschbar {

	/**
	 * Trifft zu, wenn der Eintrag geloescht ist.
	 * 
	 * @return <code>true</code>, wenn zutreffend.
	 */
	boolean isGeloescht();

	/**
	 * Loescht den Eintrag.
	 */
	void loeschen();
}
