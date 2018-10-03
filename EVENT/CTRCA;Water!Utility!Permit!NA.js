/*
Title : Establish Civil Plan Parent Relationship (ApplicationSubmitAfter)

Purpose : If the custom field “Civil Plan number” value matches a record alt id for the record type PublicWorks/Civil Plan/Review/NA
and the current record is not already a parent or grandparent of a record then make this record a child of the Civil Plan

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	establishCivilPlanParentRelationship("Civil Plan number", "PublicWorks/Civil Plan/Review/NA");
*/

if(publicUser) establishCivilPlanParentRelationship("Civil Plan number", "PublicWorks/Civil Plan/Review/NA");
