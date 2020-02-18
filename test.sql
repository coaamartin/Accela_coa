USE [ACPDev_Accela]
GO
/****** Object:  StoredProcedure [dbo].[coa_spreport_Fire_OrderNotice]    Script Date: 2/11/2020 2:44:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/******************************************************************************
Input		:None
		: 
Output		: Report Data
		:
Database	: Accela
		: 
History		: created	01/23/2020	James Warthan
		                
******************************************************************************/
 ALTER Procedure [dbo].[coa_spreport_Fire_OrderNotice]
(
   @RecordID varchar(20)
)

WITH RECOMPILE
AS 

	SET ARITHIGNORE ON
	SET NOCOUNT ON

	/*----------------------------------------*/
	/* Get Report Records	  */
	/*----------------------------------------*/



--declare @RecordID varchar(30) = '19-000056-AFR' ;
--declare @RecordID varchar(30) = '19-000095-AFR' ;  -- last sched
--declare @RecordID varchar(30) = '19-000015-AFR' ;  -- has pending 
--declare @RecordID varchar(30) = '19-000091-AFR' ;
--declare @RecordID varchar(30) = '20-000030-AFR' ; -- has >3 insp ex

select distinct
b1.b1_alt_id,
  b1.b1_per_group, 
  b1.b1_per_type,
  b1.b1_per_sub_type,
  b1.b1_per_category,
nullif(dbo.fn_get_app_spec_info(b1.serv_prov_code, b1.b1_per_id1, b1.b1_per_id2, b1.b1_per_id3, 'Business Name'),'') Business_name,
-- -------------------
-- Address fields
-- -------------------
----B3ADDRES fields  = Accela label
------b1_hse_nbr_start             - Street #
------b1_str_dir                        - Dir
------b1_str_name                    - Street Name
------B1_STR_SUFFIX           - Street type
------B1_STR_SUFFIX_DIR  - Suffix
------b1_unit_type                    - Unit type  
------b1_unit_start                    - Unit #
addr.B1_ADDRESS_NBR Address_nbr,   -- PropertyRSN,
nullif(replace(rtrim(ltrim(concat(addr.b1_hse_nbr_start,' ',addr.b1_str_dir,' ',addr.b1_str_name,' ', 
                   addr.B1_STR_SUFFIX,' ', addr.B1_STR_SUFFIX_DIR,' ',
                   addr.b1_unit_type,' ',addr.b1_unit_start))),'  ',' '),'') Address,
--  nullif(addr.b1_hse_nbr_start,'')            PropHouse,          -- Street#
--  nullif(addr.b1_str_dir,'')                       PropStreetPrefix,  -- Dir
--  nullif(addr.b1_str_name,'')                   PropStreet,          -- Street Name
--  nullif(addr.B1_STR_SUFFIX,'')          PropStreetType,  -- Street type
--  nullif(addr.B1_STR_SUFFIX_DIR,'') PropSuffix,           -- Suffix
--  nullif(rtrim(ltrim(concat(addr.b1_unit_type,' ',addr.b1_unit_start))),'') PropUnit,  -- Unit type and Unit #
--  nullif(addr.b1_situs_city,'')   PropCity, 
nullif(addr.b1_situs_state,'') PropState, 
nullif(addr.b1_situs_zip,'')    PropZip,
nullif(addr.B1_SITUS_NBRHD_PREFIX,'') PropGisId,  -- GIS id
--  -------------------------------
--  Manager, Owner and Contact
-- --------------------------------
-- Busines Manager or Owner --
-- -------------------------------
  c.B1_CONTACT_TYPE MContactType,
nullif(replace(rtrim(ltrim(concat(c.b1_fname, ' ', c.b1_lname))),'  ',' '),'') ManagerName,
  nullif(c.b1_phone1,'') MPrimary_phone,
  nullif(c.b1_phone2,'') MSecondary_phone,
-- -----------
-- Contact --
  ci.B1_CONTACT_TYPE CContactType,
nullif(replace(rtrim(ltrim(concat(ci.b1_fname, ' ', ci.b1_lname))),'  ',' '),'') ContactName, -- Indivdual
nullif(ci.b1_phone1,'') CPrimary_phone,
  nullif(ci.b1_phone2,'') CSecondary_phone,
-- -----------
--  Owner  --
  o.b1_owner_nbr,
  o.b1_primary_owner,
  o.b1_owner_status,
case
  when nullif(o.b1_owner_full_name,'')  is not null
    then nullif(o.b1_owner_full_name,'') 
  else nullif(replace(rtrim(ltrim(concat(o.b1_owner_fname, ' ', o.b1_owner_lname))),'  ',' '),'')
end  OwnerName,
nullif(o.b1_mail_address1,'') OMailAddress,
case
  when nullif(o.b1_mail_address2,'') is not null
     then nullif(o.b1_mail_address2,'')   -- MailAddress2,
  else nullif(replace(rtrim(ltrim(concat(o.b1_mail_city, ' ', o.b1_mail_state,' ', o.b1_mail_zip))),'  ',' '),'') 
end OwnerCityStateZip,
-- --------------------------------------
--  Inspection
-- --------------------------------------
  insp.g6_act_num,
  insp.insp_group,
  insp.g6_act_typ,
  insp.g6_status,
  insp.g6_status_dd,   -- Status Date
  insp.insp_result_type,
  insp.g6_rec_dd,       -- Requested Date
  insp.g6_act_dd,       -- Scheduled Date
insp.g6_compl_dd,  -- Completion Date
insp.ga_userid,
  insp.ga_fname,
  insp.ga_lname,
-- --------------------------------------
--  Violations
-- --------------------------------------
  asit.asitab_row_index,  --giv
  asit.asitab_grp_nam,     --giv
  asit.asitab_subgrp_nam,  --giv
-- -------------------
--asitab_name values
-- -------------------
[Violation] ViolationCode, 
[Comment] ViolationDesc,
  [Violation Status] ViolationStatus,
  [Sort Order] ViolationSortOrder
  --asit.guidesheet_seq_nbr,
  --asit.guide_item_seq_nbr, 
  --asit.asitab_grp_nam, 
  --asit.asitab_subgrp_nam
-- ---------------------------------------------------------
-- ---------------------------------------------------------
from b1permit b1
--  -------------------------------
--  Address
-- --------------------------------
left join dbo.B3ADDRES addr
  on (b1.serv_prov_code = addr.serv_prov_code
  and b1.b1_per_id1 = addr.b1_per_id1
  and b1.b1_per_id2 = addr.b1_per_id2
  and b1.b1_per_id3 = addr.b1_per_id3
  and addr.b1_primary_addr_flg = 'Y'
)
--  -------------------------------
--  Manager, Owner and Contact
-- --------------------------------
left join dbo.B3CONTACT c
  on (b1.serv_prov_code = c.serv_prov_code
  and b1.b1_per_id1 = c.b1_per_id1
  and b1.b1_per_id2 = c.b1_per_id2
  and b1.b1_per_id3 = c.b1_per_id3
  and c.b1_contact_type = 'Business Manager or Owner'
 )
 left join dbo.B3CONTACT ci
  on (b1.serv_prov_code = ci.serv_prov_code
  and b1.b1_per_id1 = ci.b1_per_id1
  and b1.b1_per_id2 = ci.b1_per_id2
  and b1.b1_per_id3 = ci.b1_per_id3
  and ci.b1_contact_type = 'Inspection Contact'
 )

 --only use 
left join dbo.B3OWNERS o
  on (b1.serv_prov_code = o.serv_prov_code
  and b1.b1_per_id1 = o.b1_per_id1
  and b1.b1_per_id2 = o.b1_per_id2
  and b1.b1_per_id3 = o.b1_per_id3
  and (o.b1_primary_owner = 'Y' )
 )
-- --------------------------------------
--  Inspection  (Last Inspection)
-- --------------------------------------
join g6action insp
on  (b1.serv_prov_code = insp.serv_prov_code
and b1.b1_per_id1 = insp.b1_per_id1
and b1.b1_per_id2 = insp.b1_per_id2
and b1.b1_per_id3 = insp.b1_per_id3
and insp.rec_status = 'A'
and insp.g6_act_num = (select max(insp2.g6_act_num)  -- Last Inspection
                                      from g6action insp2
                                      where b1.serv_prov_code = insp2.serv_prov_code
                                          and b1.b1_per_id1 = insp2.b1_per_id1
                                          and b1.b1_per_id2 = insp2.b1_per_id2
                                          and b1.b1_per_id3 = insp2.b1_per_id3
                                          and insp2.rec_status = 'A'
                                          --and insp2.g6_status != 'Scheduled'
                                     )
--and insp.g6_act_typ in ('') -- Need this??
--and insp.g6_compl_dd is not null  -- Status = Scheduled not complete, remove this
)
-- -------------------------------
-- Violations
-- -------------------------------
join
   (SELECT giv.serv_prov_code, giv.GUIDESHEET_SEQ_NBR,  gi.GUIDE_ITEM_SEQ_NBR,
           gi.guide_type,gi.guide_item_text,gi.guide_item_status,
           g.b1_per_id1, g.b1_per_id2, g.b1_per_id3, g.g6_act_num,
           giv.asitab_grp_nam, giv.asitab_subgrp_nam,
           giv.asitab_row_index, giv.asitab_name,  giv.attribute_value
        From GGUIDESHEET g
        join GGUIDESHEET_ITEM gi
        on (g.SERV_PROV_CODE = gi.SERV_PROV_CODE
        and g.GUIDESHEET_SEQ_NBR = gi.GUIDESHEET_SEQ_NBR
        and gi.rec_status = 'A'
        and gi.guide_type = 'Fire Violations'
        )
        join GGDSHEET_ITEM_ASITAB_VALUE giv
        on (gi.SERV_PROV_CODE = giv.SERV_PROV_CODE
        and gi.GUIDESHEET_SEQ_NBR = giv.GUIDESHEET_SEQ_NBR
        and gi.GUIDE_ITEM_SEQ_NBR = giv.GUIDEITEM_SEQ_NBR  --****
        and (giv.rec_status = 'A' or giv.rec_status is null)
        )
        where g.rec_status = 'A'
            and giv.asitab_name in ('Violation', 'Comment','Violation Status', 'Sort Order')
   ) Atbl
PIVOT  
    (min(attribute_value)  
     FOR asitab_name  IN
        (          
          [Violation], 
          [Comment],
          [Violation Status],
          [Sort Order]
         )
    ) AS asit
on (b1.serv_prov_code = asit.serv_prov_code
  and b1.b1_per_id1 = asit.b1_per_id1
  and b1.b1_per_id2 = asit.b1_per_id2
  and b1.b1_per_id3 = asit.b1_per_id3
  and insp.g6_act_num = asit.g6_act_num
)
-- ------------------------------------
--   MAIN WHERE
-- ------------------------------------
where  b1.serv_prov_code = 'AURORACO'
and b1.rec_status = 'A'
and b1.b1_per_group = 'Fire'
and [Violation Status] = 'Non Compliance'
and [Violation] is not null
and b1.b1_alt_id = @RecordID
order by b1.b1_alt_id, insp.g6_act_num,
--asit.guidesheet_seq_nbr, asit.guide_item_seq_nbr, asit.asitab_grp_nam, asit.asitab_subgrp_nam,
--asit.asitab_row_index, 
ViolationSortOrder
;