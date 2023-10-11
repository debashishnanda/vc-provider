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
DROP TABLE IF EXISTS `credid_vc_provider`.`tenant`;
DROP TABLE IF EXISTS `credid_vc_provider`.`database_version`;

CREATE TABLE `credid_vc_provider`.`database_version` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `version` INTEGER NOT NULL,
    `description` VARCHAR(255)
);
INSERT INTO `credid_vc_provider`.`database_version`(`version`, `description`) VALUES(1,'Initialise database');

CREATE TABLE `credid_vc_provider`.`tenant` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255),
    created_when TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    modified_when TIMESTAMP
);
INSERT INTO `credid_vc_provider`.`tenant`(`name`) VALUES('Fintech Solutions');

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
    `pii_type` ENUM ('raw', 'masked', 'tokenized', 'redacted'),
    CONSTRAINT fk_role_pii_type_id FOREIGN KEY (roleId) REFERENCES `role`(`id`));
    
INSERT INTO `credid_vc_provider`.`role_pii_type`(`roleId`, `pii_type`) VALUES(0,'masked');
INSERT INTO `credid_vc_provider`.`role_pii_type`(`roleId`, `pii_type`) VALUES(1,'raw');
INSERT INTO `credid_vc_provider`.`role_pii_type`(`roleId`, `pii_type`) VALUES(2,'tokenized');
INSERT INTO `credid_vc_provider`.`role_pii_type`(`roleId`, `pii_type`) VALUES(3,'redacted');

CREATE TABLE `credid_vc_provider`.credential_type (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `parentId` INTEGER,
    `displayName` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255),
    PRIMARY KEY (id)
);
INSERT INTO `credential_type`(`id`, `name`, `parentId`, displayName) VALUES(1,'VerifiableCredential', 0, 'VerifiableCredential');
INSERT INTO `credential_type`(`id`, `name`, `parentId`, displayName) VALUES(2,'ContactCredential', 1, 'ContactCredential');
INSERT INTO `credential_type`(`id`, `name`, `parentId`, displayName) VALUES(3,'IdentityCredential', 1, 'IdentityCredential');
INSERT INTO `credential_type`(`id`, `name`, `parentId`, displayName) VALUES(4,'EmploymentCredential', 1, 'EmploymentCredential');
INSERT INTO `credential_type`(`id`, `name`, `parentId`, displayName) VALUES(5,'EmailCredential', 2, 'EmailCredential');
INSERT INTO `credential_type`(`id`, `name`, `parentId`, displayName) VALUES(6,'DateOfBirthCredential', 3, 'DateOfBirthCredential');
INSERT INTO `credential_type`(`id`, `name`, `parentId`, displayName) VALUES(7,'MobileNumberCredential', 2, 'MobileNumberCredential');
INSERT INTO `credential_type`(`id`, `name`, `parentId`, displayName) VALUES(8,'NameCredential', 2, 'NameCredential');
INSERT INTO `credential_type`(`id`, `name`, `parentId`, displayName) VALUES(9,'PostalAddressCredential', 2, 'PostalAddressCredential');
INSERT INTO `credential_type`(`id`, `name`, `parentId`, displayName) VALUES(10,'SocialSecurityNumberCredential', 3, 'SocialSecurityNumberCredential');

CREATE TABLE `credid_vc_provider`.field (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `displayName` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255),
    PRIMARY KEY (id)
);
INSERT INTO `field`(`id`,`name`, displayName) VALUES(0, 'firstName', 'First Name');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(1, 'middleName', 'Middle Name');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(2, 'lastName', 'Last Name');

INSERT INTO `field`(`id`,`name`, displayName) VALUES(3, 'domain', 'Domain');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(4, 'localPart', 'Local Part');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(5, 'emailAddress', 'Email Address');


INSERT INTO `field`(`id`,`name`, displayName) VALUES(6, 'completeDateOfBirth', 'Complete Date Of Birth');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(7, 'yearOfBirth', 'Year Of Birth');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(8, 'monthOfBirth', 'Month Of Birth');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(9, 'dayOfBirth', 'Day Of Birth');


INSERT INTO `field`(`id`,`name`, displayName) VALUES(10, 'countryCode', 'Country Code');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(11, 'areaCode', 'Area Code');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(12, 'mobileNumber', 'Mobile Number');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(13, 'msisdn', 'MSISDN');

INSERT INTO `field`(`id`,`name`, displayName) VALUES(14, 'streetAddress', 'Street Adress');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(15, 'aptSuiteNumber', 'Apartment/Suite Number');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(16, 'addressLocality', 'Address Locality');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(17, 'addressRegion', 'Address Region');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(18, 'postalCode', 'Postal Code/ZIP');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(19, 'addressCountry', 'Address Country');

INSERT INTO `field`(`id`,`name`, displayName) VALUES(20, 'socialSecurityNumber', 'Social Security Number');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(21, 'last4digits', 'Last 4 digits');

INSERT INTO `field`(`id`,`name`, displayName) VALUES(22, 'employerName', 'Employer Name');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(23, 'jobTitle', 'Job Ttile');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(24, 'employmentStartDate', 'Employment Start Date');
INSERT INTO `field`(`id`,`name`, displayName) VALUES(25, 'employmentEndDate', 'Employment End Date');


CREATE TABLE `credid_vc_provider`.field_credential_type (
    `fieldId` INTEGER NOT NULL,
    `credentialTypeId` INTEGER NOT NULL,
    CONSTRAINT fk_fieldCredentialType_field_id FOREIGN KEY (fieldId) REFERENCES `field`(id),
    CONSTRAINT fk_fieldCredentialType_credentialType_id FOREIGN KEY (credentialTypeId) REFERENCES `credential_type`(id)
);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(0,8);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(1,8);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(2,8);

INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(3,5);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(4,5);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(5,5);

INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(6,6);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(7,6);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(8,6);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(9,6);

INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(10,7);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(11,7);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(12,7);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(13,7);

INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(14,9);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(15,9);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(16,9);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(17,9);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(18,9);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(19,9);

INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(20,10);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(21,10);

INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(22,4);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(23,4);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(24,4);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(25,4);

CREATE TABLE `credid_vc_provider`.user (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `did` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) DEFAULT NULL,
    `mobileNumber` VARCHAR(255) DEFAULT NULL,
    created_when TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    modified_when TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT fk_user_tenant_id FOREIGN KEY (tenantId) REFERENCES `tenant`(`id`)
);

CREATE TABLE `credid_vc_provider`.user_information (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    userId INTEGER NOT NULL,
    fieldId INTEGER NOT NULL,
    issueDate TIMESTAMP,
    expiryDate TIMESTAMP,
    `value` VARCHAR(255),
    isBlocked TINYINT DEFAULT 0 NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT fk_userInfo_user_id FOREIGN KEY (userId) REFERENCES `user`(id),
    CONSTRAINT fk_userInfo_field_id FOREIGN KEY (fieldId) REFERENCES `field`(id)
);

CREATE TABLE `credid_vc_provider`.pii_access_log (
    user_info_id INTEGER NOT NULL,
    pii_type ENUM ('raw', 'masked', 'tokenized', 'redacted'),
    created_when TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    reason ENUM('Analytics and Insights', 'Security', 'Customer Service', 'Transaction and Payments', 'Communication', 'Legal and Regulatory Compliance', 'Membership and Subscriptions'),
    CONSTRAINT fk_piiAccessLog_userInfo_id FOREIGN KEY (user_info_id) REFERENCES `user_information`(`id`)
);

DELIMITER $$

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_get_userByEmailOrPhone`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_get_userByEmailOrPhone`(
    in_tenantId INTEGER,
    in_email VARCHAR(255),
    in_mobileNumber VARCHAR(255)
)
BEGIN
    SELECT did
    FROM `credid_vc_provider`.`user` u
    INNER JOIN tenant t on t.id = u.tenantId
    WHERE t.id = in_tenantId
        AND (
            u.email = in_email
    	        OR u.mobileNumber = in_mobileNumber
        )
    LIMIT 1; 
END $$

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_create_user`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_create_user`(
    in_tenantId INTEGER,
    in_did VARCHAR(255),
    in_email VARCHAR(255),
    in_mobileNumber VARCHAR(255)
)
BEGIN
	IF (
		in_email IS NULL AND in_mobileNumber IS NULL
	) THEN 
		SET @ERROR_MSG = 'pr_create_user: Both email and phone cannot be null';
		SIGNAL SQLSTATE '23000' SET MESSAGE_TEXT = @ERROR_MSG;
	END IF;

    IF EXISTS (
        SELECT NULL 
        FROM user 
        WHERE 
            tenantId = in_tenantId 
                AND ( 
                    did = in_did 
                    OR (email IS NOT NULL AND email = in_email)
                    OR (mobileNumber IS NOT NULL AND mobileNumber = in_mobileNumber)
                )
    ) THEN 
		SET @ERROR_MSG = 'pr_create_user: User already exists';
		SIGNAL SQLSTATE '23000' SET MESSAGE_TEXT = @ERROR_MSG;
	END IF;

    INSERT INTO user(tenantId, `did`, email, mobileNumber) VALUES(in_tenantId, in_did, in_email, in_mobileNumber);
    SELECT LAST_INSERT_ID() AS userId;
END $$

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_add_user_info`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_add_user_info`(
    in_userId INTEGER(255),
    in_fieldName VARCHAR(255),
    in_value VARCHAR(255)
)
BEGIN
	DECLARE _now TIMESTAMP;
    DECLARE _fieldId VARCHAR(255);
    SET _now = CURRENT_TIMESTAMP;

    SELECT `id` INTO _fieldId FROM field WHERE `name` = in_fieldName;
    INSERT INTO user_information(userId, fieldId, issueDate, expiryDate, `value`) 
        VALUES (in_userId, _fieldId, _now, DATE_ADD(_now, INTERVAL 1 YEAR), in_value);
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

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_get_parent_vc_type`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_get_parent_vc_type`(
    in_vcType VARCHAR(255)
)
BEGIN
    DECLARE _credId INTEGER;
    SELECT id INTO _credId from credential_type ct where ct.name = in_vcType;

    -- recursive to collect all the parents of a vctype ---
	SELECT T2.name
    FROM (
        SELECT
            @r AS _id,
            (SELECT @r := parentId FROM credential_type WHERE id = _id) AS parentId,
            @l := @l + 1 AS lvl
        FROM
            (SELECT @r := _credId, @l := 0) vars,
            credential_type h
        WHERE @r <> 0) T1
    JOIN credential_type T2
    ON T1._id = T2.id
    ORDER BY T1.lvl DESC;
END $$

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_get_user_info_for_vc`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_get_user_info_for_vc`(
    in_tenantId VARCHAR(255),
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
    INNER JOIN user u ON u.id = ui.userId 
    INNER JOIN tenant t ON t.id = u.tenantId
    INNER JOIN field f ON f.id = ui.fieldId
    INNER JOIN field_credential_type fct ON fct.fieldId = f.id
    INNER JOIN credential_type ct ON ct.id = fct.credentialTypeId
    WHERE u.did = in_userDid
        AND t.id = in_tenantId
   		AND ct.name = in_vcType;
END $$

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_get_user_info`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_get_user_info`(
    in_tenantId INTEGER,
    in_userDid VARCHAR(255)
)
BEGIN
	SELECT 
        ui.id,
        ui.fieldId,
        f.`name`,
        ui.`value`,
        u.did,
        ui.issueDate,
        ui.expiryDate,
        ct.displayName AS credentialType
    FROM user_information ui
    INNER JOIN user u ON u.id = ui.userId 
    INNER JOIN tenant t ON t.id = u.tenantId
    INNER JOIN field f ON f.id = ui.fieldId
    INNER JOIN field_credential_type fct ON fct.fieldId = f.id
    INNER JOIN credential_type ct ON ct.id = fct.credentialTypeId
    WHERE t.id = in_tenantId
        AND u.did = in_userDid;
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
    DECLARE _tokenizedCount INTEGER;
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

    SELECT count(*) INTO _tokenizedCount
    FROM credid_vc_provider.pii_access_log pal
    INNER JOIN user_information ui on ui.id = pal.user_info_id
    WHERE ui.userDid = in_userDid
        AND pii_type = 'tokenized';
    
    SELECT count(*) INTO _redactedCount
    FROM credid_vc_provider.pii_access_log pal
    INNER JOIN user_information ui on ui.id = pal.user_info_id
    WHERE ui.userDid = in_userDid
        AND pii_type = 'redacted';
    
    SELECT _rawCount AS rawCount,
        _maskedCount AS maskedCount,
        _tokenizedCount AS tokenizedCount,
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

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_get_pii_list_of_user`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_get_pii_list_of_user`(
    in_userDid VARCHAR(255)
)
BEGIN
	SELECT 
        ct.displayName AS credentialType,
        f.displayName AS piiName
    FROM user_information ui
    INNER JOIN field f ON ui.fieldId = f.id
    INNER JOIN field_credential_type fct ON fct.fieldId = f.id
    INNER JOIN credential_type ct ON ct.id = fct.credentialTypeId
    WHERE ui.userDid = in_userDid;
END $$ 

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_get_total_secured_pii`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_get_total_secured_pii`(
)
BEGIN
	SELECT count(*) AS count
    FROM field;
END $$

DELIMITER ;
