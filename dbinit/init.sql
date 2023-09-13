CREATE DATABASE IF NOT EXISTS credid_vc_provider;

USE credid_vc_provider;

DROP TABLE IF EXISTS `credid_vc_provider`.pii_access_log;
DROP TABLE IF EXISTS `credid_vc_provider`.user_information;
DROP TABLE IF EXISTS `credid_vc_provider`.`user`;
DROP TABLE IF EXISTS `credid_vc_provider`.field_credential_type;
DROP TABLE IF EXISTS `credid_vc_provider`.`field`;
DROP TABLE IF EXISTS `credid_vc_provider`.credential_type;

CREATE TABLE `credid_vc_provider`.credential_type (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255),
    PRIMARY KEY (id)
);
INSERT INTO `credential_type`(`id`, `name`) VALUES(0,'VerifiedCredential');
INSERT INTO `credential_type`(`id`, `name`) VALUES(1,'EmailCredential');
INSERT INTO `credential_type`(`id`, `name`) VALUES(2,'DateOfBirthCredential');
INSERT INTO `credential_type`(`id`, `name`) VALUES(3,'CellPhoneCredential');
INSERT INTO `credential_type`(`id`, `name`) VALUES(4,'NameCredential');
INSERT INTO `credential_type`(`id`, `name`) VALUES(5,'EmploymentCredential');
INSERT INTO `credential_type`(`id`, `name`) VALUES(6,'AddressCredential');
INSERT INTO `credential_type`(`id`, `name`) VALUES(7,'SSNCredential');


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
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(0,0);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(1,0);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(2,0);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(3,0);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(4,0);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(5,0);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(6,0);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(7,0);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(8,0);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(9,0);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(10,0);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(0,4);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(1,4);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(2,1);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(3,2);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(4,3);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(5,6);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(6,6);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(7,6);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(8,6);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(9,6);
INSERT INTO `field_credential_type`(`fieldId`, `credentialTypeId`) VALUES(10,7);


CREATE TABLE `credid_vc_provider`.user (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `did` VARCHAR(255) NOT NULL UNIQUE,
    created_when TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    modified_when TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE `credid_vc_provider`.user_information (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    userId INTEGER NOT NULL,
    fieldId INTEGER NOT NULL,
    issueDate TIMESTAMP,
    expiryDate TIMESTAMP,
    `value` VARCHAR(255),
    PRIMARY KEY (id),
    CONSTRAINT fk_userInfo_user_id FOREIGN KEY (userId) REFERENCES `user`(id),
    CONSTRAINT fk_userInfo_field_id FOREIGN KEY (fieldId) REFERENCES `field`(id)
);

CREATE TABLE `credid_vc_provider`.pii_access_log (
    user_info_id INTEGER NOT NULL,
    pii_type ENUM ('raw', 'masked', 'tokenised'),
    created_when TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    created_by_id INTEGER NOT NULL,
    reason ENUM('Analytics and Insights', 'Security', 'Customer Service', 'Transaction and Payments', 'Communication', 'Legal and Regulatory Compliance', 'Membership and Subscriptions'),
    CONSTRAINT fk_piiAccessLog_userInfo_id FOREIGN KEY (user_info_id) REFERENCES `user_information`(`id`),
    CONSTRAINT fk_piiAccessLog_user_id FOREIGN KEY (created_by_id) REFERENCES `user`(`id`)
);

DELIMITER $$

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_create_user`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_create_user`(
    in_did VARCHAR(255)
)
BEGIN
    INSERT INTO user(`did`) VALUES(in_did);
    SELECT `id` AS id FROM user where `id`=LAST_INSERT_ID();
END $$

DROP PROCEDURE IF EXISTS `credid_vc_provider`.`pr_add_user_info`$$
CREATE PROCEDURE `credid_vc_provider`.`pr_add_user_info`(
    in_userId INTEGER,
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
DELIMITER ;