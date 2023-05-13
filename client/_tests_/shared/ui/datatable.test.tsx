import TableComponent from "../../../src/shared/ui/table/dataTable";
import {columns, dataSource} from "../../fixtures/datatable.fixture";
import { create } from 'react-test-renderer'

describe('Data table test',()=>{
    test('should match the captured screenshot', () => {
        let tree = create(<TableComponent  columns={columns} dataSource={dataSource} />,{});
        expect(tree.toJSON()).toMatchSnapshot();
    })
})