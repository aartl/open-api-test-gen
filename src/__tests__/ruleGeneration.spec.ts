import { rulesFromOpenApiDefinitions } from '../rules';
import { swagger } from './fixtures/swagger.fixture';
describe('Rule generation', () => {
  it('should return array of rules', () => {
    const result = rulesFromOpenApiDefinitions(swagger);

    expect(result).toEqual([
      { '$.Order.id': 'is a number' },
      { '$.Order.petId': 'is a number' },
      { '$.Order.quantity': 'is a number' },
      { '$.Order.shipDate': 'is a date' },
      { '$.Order.status': 'is text' },
      { '$.Category.id': 'is a number' },
      { '$.Category.name': 'is text' },
      { '$.User.id': 'is a number' },
      { '$.User.username': 'is text' },
      { '$.User.firstName': 'is text' },
      { '$.User.lastName': 'is text' },
      { '$.User.email': 'is text' },
      { '$.User.password': 'is text' },
      { '$.User.phone': 'is text' },
      { '$.User.userStatus': 'is a number' },
      { '$.Tag.id': 'is a number' },
      { '$.Tag.name': 'is text' },
      { '$.Pet.id': 'is a number' },
      { '$.Pet.category.id': 'is a number' },
      { '$.Pet.category.name': 'is text' },
      { '$.Pet.name': 'is text' },
      { '$.Pet.photoUrls': 'string' },
      { '$.Pet.tags.id': 'is a number' },
      { '$.Pet.tags.name': 'is text' },
      { '$.Pet.status': 'is text' },
    ]);
  });
});
