package org.joht.livecoding.becomingfunctional.firstclass.converter;

import org.joht.livecoding.becomingfunctional.firstclass.api.Kunde;

/**
 * Beschreibt den Aufbau des Funktions-Objects, <br>
 * das aus einem {@link Kunde}n (=Parameter) ein Textfeld als {@link String} (=Rueckgabe) liefert.
 * <p>
 * Um das "zweitrangige" Sprachmittel einer Java-Methode zu einem "first-class" Bestandteil zu
 * machen, wird sie als Objekt dargestellt. Dieses Objekt hat genau eine Methode mit dem Inhalt der
 * Funktion. Objekte mit mehr als einer Methode (oder keiner Methode) koennen keine Funktionen
 * repraesentieren, da dann nicht eindeutig klar waere, wie die Funktion auszufuehren ist.
 * <p>
 * Um ein selbstgeschriebenes Interface (selten notwendig, hier nur als Beispiel) mit dem
 * Lambda-Syntax verwenden zu koennen, wird die Annotation {@link FunctionalInterface} verwendet.
 * 
 * @author johannestroppacher
 */
@FunctionalInterface
public interface KundenTextFeldMapper {

	String getTextFeld(Kunde kunde);

}