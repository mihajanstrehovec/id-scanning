import {
	DocumentType,
	DocumentSelection,
	IdBoltSession,
	Region,
	Validators,
  ReturnDataMode,
  CancellationReason,
} from "@scandit/web-id-bolt";

const ID_BOLT_URL = "https://app.id-scanning.com";

const LICENSE_KEY = "AmwVWgZUIP8dMB2qSD7QVLkuOZoqF/reWyp7ND49rkUERqdcciNzWv5z+6eHQB4b0XXAGh4W19rAd0I0smNKs1Q47kKFecZCnn0694ZBDrKzbSYbRkZ4+ZlMDmOgddngwW73yj4knj24NxitxD5GkYouSnnUYLAWx1nzIc16F3hOQ6uXxTc9m4h++w1dVa9nb3nAqaM/57GMC8ShVBAS+4RVpL+YX2xsq3OXcflUxJ7MI/gPN1YU72tWVgsWRUfnmyaqY14VhjIjNbu+YUz9DvRydEJUf8h6pFrvsetusm4WBeVWjWTr8SVJWBnLXoTHCmOeMe1HGfriMGLTv1+wdKMc8IOKWjyluhNhOSdq1a8EZfRFMVQQh0M9g1FOUKekQ17HeDoyyO3ZVlFfH38FN/AtXFradxATP0xwWHIh5rn8eKIO8QKyJr1NRnfXbdzvJXVeZ1x8iZ1cZCdnZXMgIGloPwzNEr+rbkGjcBU0w/axSTUnQWDDzMhZB2edZXyD/Gxnx/N2FLNJekcDFHNskZtMAoe5WLWgjWT8LA9NvVxjYPk1XA+cZGhIgsrMpikwIRLepnfNzK/aSg7NuIKS40chTGp0F+0WLvPwyo0Q4M9VoY7uri1Nj6JghEfSxqbN24gRkbTU9j3JqKuL9ocWUzNz8DnfigKq1oCpc9Baxb9xJobGBHB3IHhyNCEFhbuGwUXXnYY/8LtZs5hhmAofrel2WrQziEIh9JFtOjl92YkWCV0IstemdguXhbQLqQdosJHL+bOLCrVTHuY47E9XCGSTCYuTJMJiMWp+ThP5pHMNlbt07NuAMVKKTvBgbIlXM1m3j8fAsqzEePbJEXCrDkr0m4iVHlzK1J/Qs5zVDVlp+H/uzfqnvP4C/BzwZSxROjjIizodvujDYhSJ+gQMFgXVQtHDBwnXTgMHPjPLvnt4p+oui2MouCx9MVmR5SVc2JMUny02kRREkBDzf6vhNIaIVt3OnPbdGoPfuFkremwi0gs7J1TuWK3RsIvL17efXFxKfHfy2vehmSmxCfcOQmCSkym47hPyll5KB2GCi6OzbpGfC+C0VmpEfkEdoSuzhVqoTc0Q2CELI4K2VT5nQji/6GzsCQCPbBjpCp59wN53osytXI2VwHVE+YgHFIZQlEHMG6utlFf0dT7v0c8qxK5itzjk7X5XrKUf/iq1uWL++80VSCpk7g1ZUldnshaLaNECO62xYnbSekSljN24nG8Y1FEGnhjTxw==";

const mapScanditDocumentType = {
  'Passport': 'P',
  'IDCard': 'I',
  'DriverLicense': 'D',
}

export async function startIdBolt() {
	// define which documents are allowed to be scanned. More complex rules can be added.
	const documentSelection = DocumentSelection.create({
		include: [[Region.WorldWide, DocumentType.All]],
	});
	// initialization of the ID Bolt session
	const idBoltSession = IdBoltSession.create(ID_BOLT_URL, {
		licenseKey: LICENSE_KEY,
		documentSelection,
		// define what data you expect in the onCompletion listener (set below)
		returnDataMode: ReturnDataMode.Full,
		// add validation rules on the scanned document
		validation: [Validators.notExpired()],
		locale: "en",
    textOverrides: {
      "titles.SCANNER_HEADER": "Scan your Passport for John Doe",
      "titles.LOCAL_SCAN_HEADER": "Scan your Passport for John Doe",
      "texts.HELP_SUPPORTED_DOCUMENTS_INCLUDE_LIST": "Scan your passport, ID card or driver license",
      "texts.HELP_SUPPORTED_DOCUMENTS_INCLUDE_LIST_BRIEF": "Scan your passport, ID card or driver license",
      "texts.HELP_SUPPORTED_DOCUMENTS_EXCLUDE_LIST": "Not accepted are documents issued before 2000",
    },
    theme: {
      colors: {
          primary: "#007AFF"
      },
      dimensions: {
          radiusButton: "8px"
      }
    },
		onCompletion: (result) => {
			// the ID has been captured and validation was successful. In this example the result
			// will contain the document data because `returnDataMode` was set to RETURN_DATA_MODE.FULL.
      result.capturedId.documentType = mapScanditDocumentType[result.capturedId.documentType]
      console.log(result);
			alert(`Thank you ${result.capturedId.fullName}`);
		},
		onCancellation: (reason) => {
      switch (reason) {
        case CancellationReason.UserClosed:
          console.log("User closed the scanning window");
          break;
        case CancellationReason.ServiceStartFailure:
          console.log("ID Bolt service failed to start");
          break;
      }
    }
	});
	// open the pop-up
	await idBoltSession.start();
}