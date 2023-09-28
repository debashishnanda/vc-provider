CREATE DATABASE IF NOT EXISTS credid_vc_provider;

USE credid_vc_provider;

DROP TABLE IF EXISTS `credid_vc_provider`.`role_pii_type`;
DROP TABLE IF EXISTS `credid_vc_provider`.pii_access_log;
DROP TABLE IF EXISTS `credid_vc_provider`.user_information;
DROP TABLE IF EXISTS `credid_vc_provider`.`user`;
DROP TABLE IF EXISTS `credid_vc_provider`.field_credential_type;
DROP TABLE IF EXISTS `credid_vc_provider`.`field`;
DROP TABLE IF EXISTS `credid_vc_provider`.credential_type;
DROP TABLE IF EXISTS `credid_vc_provider`.`role`;
DROP TABLE IF EXISTS `credid_vc_provider`.`database_version`;

CREATE TABLE `credid_vc_provider`.`database_version` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `version` INTEGER NOT NULL,
    `description` VARCHAR(255)
);
INSERT INTO `credid_vc_provider`.`database_version`(`version`, `description`) VALUES(1,'Initialise database');

CREATE TABLE `credid_vc_provider`.`role` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255),
    PRIMARY KEY (id)
);
    
INSERT INTO `credid_vc_provider`.`role`(`id`, `name`) VALUES(0,'US Infosec Support');
INSERT INTO `credid_vc_provider`.`role`(`id`, `name`) VALUES(1,'Marketing Team');
INSERT INTO `credid_vc_provider`.`role`(`id`, `name`) VALUES(2,'Business Analytics');
INSERT INTO `credid_vc_provider`.`role`(`id`, `name`) VALUES(3,'Consultants');


CREATE TABLE `credid_vc_provider`.`role_pii_type` (
    `roleId` INTEGER NOT NULL,
    `pii_type` ENUM ('raw', 'masked', 'tokenised', 'redacted'),
    CONSTRAINT fk_role_pii_type_id FOREIGN KEY (roleId) REFERENCES `role`(`id`));
    
INSERT INTO `credid_vc_provider`.`role_pii_type`(`roleId`, `pii_type`) VALUES(0,'masked');
INSERT INTO `credid_vc_provider`.`role_pii_type`(`roleId`, `pii_type`) VALUES(1,'raw');
INSERT INTO `credid_vc_provider`.`role_pii_type`(`roleId`, `pii_type`) VALUES(2,'tokenised');
INSERT INTO `credid_vc_provider`.`role_pii_type`(`roleId`, `pii_type`) VALUES(3,'redacted');

CREATE TABLE `credid_vc_provider`.credential_type (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255),
    PRIMARY KEY (id)
);
INSERT INTO `credential_type`(`id`, `name`) VALUES(0,'EmailCredential');
INSERT INTO `credential_type`(`id`, `name`) VALUES(1,'DateOfBirthCredential');
INSERT INTO `credential_type`(`id`, `name`) VALUES(2,'CellPhoneCredential');
INSERT INTO `credential_type`(`id`, `name`) VALUES(3,'NameCredential');
INSERT INTO `credential_type`(`id`, `name`) VALUES(4,'EmploymentCredential');
INSERT INTO `credential_type`(`id`, `name`) VALUES(5,'AddressCredential');
INSERT INTO `credential_type`(`id`, `name`) VALUES(6,'SSNCredential');


CREATE TABLE `credid_vc_provider`.field (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255),
    PRIMARY KEY (id)
);
INSERT INTO `field`(`id`,`name`) VALUES(0, 'firstName');
INSERT INTO `field`(`id`,`name`) VALUES(1, 'lastName');
INSERT INTO `field`(`id`,`name`) VALUES(2, 'email');
INSERT INTO `field`(`id`,`name`) VALUES(3, 'dob');
INSERT INTO `field`(`id`,`name`) VALUES(4, 'cellPhone');
INSERT INTO `field`(`id`,`name`) VALUES(5, 'street');
INSERT INTO `field`(`id`,`name`) VALUES(6, 'apt');
INSERT INTO `field`(`id`,`name`) VALUES(7, 'city');
INSERT INTO `field`(`id`,`name`) VALUES(8, 'state');
INSERT INTO `field`(`id`,`name`) VALUES(9, 'zip');
INSERT INTO `field`(`id`,`name`) VALUES(10, 'ssn');

CREATE TABLE `credid_vc_provider`.field_credential_type (
    `fieldId` INTEGER NOT NULL,
    `credentialTypeId` INTEGER NOT NULL,
    CONSTRAINT fk_fieldCredentialType_field_id FOREIGN KEY (fieldId) REFERENCES `field`(id),
    CONSTRAINT fk_fieldCredentialType_credentialType_id FOREIGN KEY (credentialTypeId) REFERENCES `credential_type`(id)
);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(0,3);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(1,3);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(2,0);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(3,1);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(4,2);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(5,5);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(6,5);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(7,5);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(8,5);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(9,5);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(10,6);


CREATE TABLE `credid_vc_provider`.user (
    `did` VARCHAR(255) NOT NULL UNIQUE,
    `email` VARCHAR(255) UNIQUE DEFAULT NULL,
    `cellPhone` VARCHAR(255) UNIQUE DEFAULT NULL,
    created_when TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    modified_when TIMESTAMP,
    PRIMARY KEY (did)
);

CREATE TABLE `credid_vc_provider`.user_information (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    userDid VARCHAR(255) NOT NULL,
    fieldId INTEGER NOT NULL,
    issueDate TIMESTAMP,
    expiryDate TIMESTAMP,
    `value` VARCHAR(255),
    PRIMARY KEY (id),
    CONSTRAINT fk_userInfo_user_did FOREIGN KEY (userDid) REFERENCES `user`(did),
    CONSTRAINT fk_userInfo_field_id FOREIGN KEY (fieldId) REFERENCES `field`(id)
);

CREATE TABLE `credid_vc_provider`.pii_access_log (
    user_info_id INTEGER NOT NULL,
    pii_type ENUM ('raw', 'masked', 'tokenised', 'redacted'),
    created_when TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    reason ENUM('Analytics and Insights', 'Security', 'Customer Service', 'Transaction and Payments', 'Communication', 'Legal and Regulatory Compliance', 'Membership and Subscriptions'),
    CONSTRAINT fk_piiAccessLog_userInfo_id FOREIGN KEY (user_info_id) REFERENCES `user_information`(`id`)
);

DELIMITER $$

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_get_userByEmailOrPhone`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_get_userByEmailOrPhone`(
    in_email VARCHAR(255),
    in_cellPhone VARCHAR(255)
)
BEGIN
    SELECT did
    FROM `credid_vc_provider`.`user`
    WHERE email = in_email
    	OR cellPhone = in_cellPhone
    LIMIT 1; 
END $$

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_create_user`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_create_user`(
    in_did VARCHAR(255),
    in_email VARCHAR(255),
    in_cellPhone VARCHAR(255)
)
BEGIN
	IF (
		in_email IS NULL AND in_cellPhone IS NULL
	) THEN 
		SET @ERROR_MSG = 'pr_create_user: Both email and phone cannot be null';
		SIGNAL SQLSTATE '23000' SET MESSAGE_TEXT = @ERROR_MSG;
	END IF;

    INSERT INTO user(`did`, email, cellPhone) VALUES(in_did, in_email, in_cellPhone);
END $$

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_add_user_info`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_add_user_info`(
    in_userDid VARCHAR(255),
    in_fieldName VARCHAR(255),
    in_value VARCHAR(255)
)
BEGIN
	DECLARE _now TIMESTAMP;
    DECLARE _fieldId VARCHAR(255);
    SET _now = CURRENT_TIMESTAMP;

    SELECT `id` INTO _fieldId FROM field WHERE `name` = in_fieldName;
    INSERT INTO user_information(userDid, fieldId, issueDate, expiryDate, `value`) 
        VALUES (in_userDid, _fieldId, _now, DATE_ADD(_now, INTERVAL 1 YEAR), in_value);
END $$

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_get_piiType_for_role`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_get_piiType_for_role`(
    in_role VARCHAR(255)
)
BEGIN
	SELECT 
        rpt.pii_type
    FROM role_pii_type rpt 
    INNER JOIN `role` r ON r.id = rpt.roleId
   	WHERE r.name = in_role;
END $$

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_get_user_info`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_get_user_info`(
    in_userDid VARCHAR(255),
    in_vcType VARCHAR(255)
)
BEGIN
	SELECT 
        ui.id,
        ui.fieldId,
        f.`name`,
        ui.`value`,
        u.did,
        ui.issueDate,
        ui.expiryDate
    FROM user_information ui
    INNER JOIN user u ON u.did = ui.userDid 
    INNER JOIN field f ON f.id = ui.fieldId
    INNER JOIN field_credential_type fct ON fct.fieldId = f.id
    INNER JOIN credential_type ct ON ct.id = fct.credentialTypeId
    WHERE u.did = in_userDid
   		AND ct.name = in_vcType;
END $$


DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_get_credential_types`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_get_credential_types`()
BEGIN
	SELECT 
        fct.fieldId,
        ct.`name`
    FROM field_credential_type fct
    INNER JOIN credential_type ct ON ct.id = fct.credentialTypeId;
END $$

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_store_pii_access`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_store_pii_access`(
    in_userInfoId INTEGER,
    in_piiType VARCHAR(255),
    in_reason VARCHAR(255)
)
BEGIN
    DECLARE _now TIMESTAMP;
    SET _now = CURRENT_TIMESTAMP;

	INSERT INTO `credid_vc_provider`.pii_access_log
        (user_info_id, pii_type, created_when, reason)
    VALUES 
        (in_userInfoId, in_piiType, _now,  in_reason);
END $$

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_get_pii_requests`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_get_pii_requests`(
    in_userDid VARCHAR(255)
)
BEGIN
    DECLARE _rawCount INTEGER;
    DECLARE _maskedCount INTEGER;
    DECLARE _tokenisedCount INTEGER;
    DECLARE _redactedCount INTEGER;

	SELECT count(*) INTO _rawCount
    FROM credid_vc_provider.pii_access_log pal
    INNER JOIN user_information ui on ui.id = pal.user_info_id
    WHERE ui.userDid = in_userDid
        AND pii_type = 'raw';
    
    SELECT count(*) INTO _maskedCount
    FROM credid_vc_provider.pii_access_log pal
    INNER JOIN user_information ui on ui.id = pal.user_info_id
    WHERE ui.userDid = in_userDid
        AND pii_type = 'masked';

    SELECT count(*) INTO _tokenisedCount
    FROM credid_vc_provider.pii_access_log pal
    INNER JOIN user_information ui on ui.id = pal.user_info_id
    WHERE ui.userDid = in_userDid
        AND pii_type = 'tokenised';
    
    SELECT count(*) INTO _redactedCount
    FROM credid_vc_provider.pii_access_log pal
    INNER JOIN user_information ui on ui.id = pal.user_info_id
    WHERE ui.userDid = in_userDid
        AND pii_type = 'redacted';
    
    SELECT _rawCount AS rawCount,
        _maskedCount AS maskedCount,
        _tokenisedCount AS tokenisedCount,
        _redactedCount AS redactedCount;
END $$

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_get_traffic_source`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_get_traffic_source`(
    in_userDid VARCHAR(255)
)
BEGIN
	SELECT 
        pal.reason,
        count(*) AS count
    FROM credid_vc_provider.pii_access_log pal
    INNER JOIN user_information ui on ui.id = pal.user_info_id
    WHERE ui.userDid = in_userDid
    GROUP BY pal.reason;
END $$

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_get_latest_pii_requests`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_get_latest_pii_requests`(
    in_userDid VARCHAR(255)
)
BEGIN
	SELECT 
        temp.name,
        temp.pii_type,
        temp.lastAccessedDate,
        pal2.reason
    FROM pii_access_log pal2 
    INNER JOIN user_information ui2 on ui2.id = pal2.user_info_id 
    INNER JOIN field f2 on f2.id = ui2.fieldId  
    INNER JOIN 
        (	
        SELECT 
            f.name,
            pal.pii_type,
            max(pal.created_when) AS lastAccessedDate
        FROM pii_access_log pal
        INNER JOIN user_information ui on ui.id = pal.user_info_id 
        INNER JOIN field f on f.id = ui.fieldId 
        WHERE ui.userDid = in_userDid
        GROUP BY f.name, pal.pii_type 
        ) temp ON temp.name = f2.name AND temp.pii_type = pal2.pii_type  AND temp.lastAccessedDate = pal2.created_when
    WHERE ui2.userDid = in_userDid; 
END $$ 

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_get_monthly_yearly_pii_request_count`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_get_monthly_yearly_pii_request_count`(
    in_userDid VARCHAR(255),
    in_startDate TIMESTAMP,
    in_endDate TIMESTAMP
)
BEGIN
   
	SELECT 
        pal.pii_type,
        YEAR(created_when) AS year,
        MONTH(created_when) AS month,
        count(*) AS count
    FROM pii_access_log pal 
    INNER JOIN user_information ui on ui.id = pal.user_info_id 
    WHERE ui.userDid = in_userDid
        AND (in_startDate IS NULL OR pal.created_when >= in_startDate)
	    AND (in_endDate IS NULL OR pal.created_when <= in_endDate)
    GROUP BY YEAR(pal.created_when), MONTH(pal.created_when), pal.pii_type;
END $$ 
DELIMITER ;
