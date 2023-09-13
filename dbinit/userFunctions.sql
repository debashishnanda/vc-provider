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