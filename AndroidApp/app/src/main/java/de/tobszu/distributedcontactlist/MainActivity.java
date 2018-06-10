package de.tobszu.distributedcontactlist;

import android.Manifest;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.provider.ContactsContract;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = MainActivity.class.getSimpleName() ;

    ListView listView;
    private static final int PERMISSIONS_REQUEST_READ_CONTACTS = 100;
    Cursor c;
    ArrayList<String> contacts;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        listView = (ListView) findViewById(R.id.contactListView);

        int permissonCheck = ContextCompat.checkSelfPermission(this, Manifest.permission.READ_CONTACTS);


        //Check ob die Berechtigungen für die Contacte steht.
        if(permissonCheck == PackageManager.PERMISSION_GRANTED){
            showContacts();
        }
        else{
            ActivityCompat.requestPermissions(
                    this,
                    new String[]{Manifest.permission.READ_CONTACTS},
                    PERMISSIONS_REQUEST_READ_CONTACTS
            );

        }

        ArrayAdapter<String> adapter = new ArrayAdapter<String>(
                this, android.R.layout.simple_list_item_1, contacts
        );

        listView.setAdapter(adapter);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        if(requestCode == PERMISSIONS_REQUEST_READ_CONTACTS){
            if(grantResults[0] == PackageManager.PERMISSION_GRANTED){
                showContacts();
            }
            else{
                Toast.makeText(this, "Bitte Berechtigung Zulassen!", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void showContacts(){
        c = getContentResolver().query(ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                null, null ,null, ContactsContract.Contacts.DISPLAY_NAME + " ASC");
        contacts = new ArrayList<>();

        while(c.moveToNext()){
            String contactName = c.getString(c.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME));
            String contactNumber = c.getString(c.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER));
            contacts.add("Name: " + contactName + "\n" + "Nummer: " + contactNumber);
        }
        c.close();

    }
}
